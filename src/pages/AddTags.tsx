import { useContext, useState, useEffect } from "react";
import {
  Form,
  Input,
  Row,
  Col,
  Button,
  Typography,
  Tag,
  message,
  Select,
} from "antd";
import { LoadingContext } from "../context/LoadingContext";
import { PlusOutlined } from "@ant-design/icons";

const { useForm } = Form;

type FieldType = {
  tag: string;
  type: string;
};

import { PageTitle, TagsList } from "..";
import { helperService } from "../utils/helper";
import { firebaseService } from "../firebase/firebaseService";

const AddTags = () => {
  const { loading, setLoading } = useContext(LoadingContext);

  const [tags, setTags] = useState<string[]>([]);
  const [tagsList, setTagsList] = useState<string[]>([]);
  const [tagsInputValue, setTagsInputValue] = useState<string>("");
  const [tabKey, setTabKey] = useState("portfolio");

  const [tagsForm] = useForm();

  const setTagsToList = () => {
    const filteredTagsInputValue =
      helperService.removeRepeatingStrings(tagsInputValue);

    setTags((prevState) => {
      if (filteredTagsInputValue) {
        return [
          ...prevState,
          ...filteredTagsInputValue
            .split(",")
            .map((tag) => {
              if (tags.includes(tag)) {
                message.error(`${tag} already exists in the list`);
                return "";
              } else {
                return tag;
              }
            })
            .filter((tag) => tag),
        ];
      } else {
        return prevState;
      }
    });
    setTagsInputValue("");
  };

  const removeTag = (removedTag: string) => {
    const filteredTags = tags.filter((tag) => tag !== removedTag);
    setTags([...filteredTags]);
  };

  const fetchTags = async () => {
    const data = await firebaseService.getTags(tabKey);
    setTagsList(data ? data.tags : []);
  };

  const onSubmit = async (values: { tag: string; type: string }) => {
    setLoading(true);
    if (!tags.length) {
      setLoading(false);
      return message.error("Please add tags!");
    }
    await firebaseService.postTags(tags, values.type, setLoading);
    await fetchTags();
    tagsForm.resetFields();
    setTags([]);
  };

  const deleteTag = async (selectedTagsToDelete: string[]) => {
    setLoading(true);
    await firebaseService.deleteTags(selectedTagsToDelete, tabKey, setLoading);
    await fetchTags();
  };

  useEffect(() => {
    fetchTags();
  }, [tabKey]);

  return (
    <>
      <PageTitle title="Create Tags" />
      <Row gutter={16}>
        <Col xs={24} lg={16}>
          <Form
            name="create-user"
            onFinish={onSubmit}
            autoComplete="off"
            layout="vertical"
            form={tagsForm}
          >
            <Row gutter={[16, 16]} align={"middle"}>
              <Col xs={24}>
                <Form.Item<FieldType>
                  label="Select Page"
                  name="type"
                  rules={[{ required: true, message: "Required field" }]}
                >
                  <Select
                    allowClear
                    style={{ width: "100%" }}
                    placeholder="Please select"
                    options={[
                      { label: "Portfolio", value: "portfolio" },
                      { label: "Vikin", value: "vikin" },
                      { label: "Graphyl", value: "graphyl" },
                    ]}
                  />
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Form.Item<FieldType>
                  label="Add Tag"
                  name="tag"
                  rules={[{ required: true, message: "Required field" }]}
                >
                  <div className="flex items-start space-x-2">
                    <div className="w-full">
                      <Input
                        value={tagsInputValue}
                        onChange={(e) => {
                          setTagsInputValue(e.target.value);
                        }}
                        allowClear
                      />
                      <div className="flex justify-between">
                        <Typography className="!text-gray-500 font-medium !text-xs md:!text-base mt-1 md:mt-0">
                          Separate the tags by using comma's (,)
                        </Typography>
                        <Button
                          disabled={!tags.length}
                          type="link"
                          onClick={() => {
                            setTags([]);
                          }}
                          size="small"
                        >
                          Clear
                        </Button>
                      </div>
                    </div>
                    <Button icon={<PlusOutlined />} onClick={setTagsToList} />
                  </div>
                </Form.Item>

                {tags.map((tag) => (
                  <Tag
                    bordered={false}
                    closable
                    color="processing"
                    className="cursor-pointer"
                    onClose={() => {
                      removeTag(tag);
                    }}
                  >
                    {tag}
                  </Tag>
                ))}
              </Col>
              <Col xs={24}>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="float-end"
                    loading={loading}
                    disabled={loading}
                  >
                    Submit
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Col>
        <Col xs={24} lg={8}>
          <TagsList
            tags={tagsList}
            setTabKey={setTabKey}
            deleteTags={deleteTag}
          />
        </Col>
      </Row>
    </>
  );
};

export default AddTags;
