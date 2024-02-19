import { useContext, useState, useEffect } from "react";
import { Row, Col, Form, Input, Select, Button, Popconfirm } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { LoadingContext } from "../context/LoadingContext";
import { regexp, skills } from "../utils/constants";
import { firebaseService } from "../firebase/firebaseService";
import { UserContext } from "../context/UserContext";
import { PageTitle } from "..";
import { useLocation } from "react-router-dom";

type FieldType = {
  [key: string]: string | number | string[];
};

const { TextArea } = Input;
const { useForm } = Form;

const BasicDetails = () => {
  const { loading, setLoading } = useContext(LoadingContext);
  const { user } = useContext(UserContext);
  const [basicDetailsForm] = useForm();

  const location = useLocation();
  const id = location.pathname.split("/")[1];

  const [socialCount, setSocialCount] = useState(1);
  const [basicDetails, setBasicDetails] = useState<any>();

  const addRemoveSocial = (add: boolean): void => {
    setSocialCount((prevState) => (add ? prevState + 1 : prevState - 1));
  };

  const socialMap = (
    obj: BasicDetailsPayload,
    reverse = false
  ): { [key: string]: string | string[] | undefined } => {
    const dataObj: { [key: string]: string | string[] | undefined } = {
      ...obj,
    };
    if (reverse) {
      let index = 0;
      Object.entries(obj).forEach(([key, value]) => {
        if (typeof value === "string" && value.startsWith("http")) {
          dataObj[`mediaType-${index}`] = key;
          dataObj[`url-${index}`] = value;
          delete dataObj[key];
          index++;
        }
      });
      setSocialCount(index);
    } else {
      Object.entries(obj).forEach(([key, value]) => {
        const match = key.match(/(mediaType|url)-(\d+)/);
        if (match) {
          const [, type, index] = match;
          if (type === "mediaType") {
            dataObj[value as string] = obj[`url-${index}`];
          }
          delete dataObj[key];
        }
      });
    }
    return dataObj;
  };

  const getBasicDetails = async () => {
    const data: BasicDetails | boolean = await firebaseService.getBasicDetails(
      id
    );

    if (typeof data === "object" && data.bio) {
      const updatedData = socialMap({ ...data }, true);
      setBasicDetails(updatedData);
      basicDetailsForm.setFieldsValue({
        ...updatedData,
      });
    } else {
      basicDetailsForm.resetFields();
    }
  };

  const onSubmit = (values: BasicDetailsPayload) => {
    const payload = { ...socialMap(values) };
    setLoading(true);
    firebaseService.postBasicDetails(payload, setLoading, user.user, id);
  };

  const onConfirmDelete = (idx: number) => {
    firebaseService.deleteSocialMap(basicDetails[`mediaType-${idx}`], id);
    addRemoveSocial(false);
  };

  useEffect(() => {
    getBasicDetails();
  }, [id]);
  return (
    <>
      <PageTitle title={`${id} - Basic Details`} />
      <Form
        name="create-user"
        onFinish={onSubmit}
        autoComplete="off"
        layout="vertical"
        form={basicDetailsForm}
      >
        <Row gutter={[16, 16]} align={"middle"}>
          <Col xs={24}>
            <Form.Item<FieldType>
              label="Bio"
              name="bio"
              rules={[
                { required: true, message: "Required field" },
                { max: 1000, message: "Character limit reached" },
              ]}
            >
              <TextArea allowClear showCount maxLength={1000} />
            </Form.Item>
          </Col>
          <Col xs={12}>
            <Form.Item<FieldType>
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Required field" },
                { type: "email", message: "Please enter a valid email!" },
              ]}
            >
              <Input allowClear />
            </Form.Item>
          </Col>
          <Col xs={12}>
            <Form.Item<FieldType>
              label="Mobile Number"
              name="mobile"
              rules={[
                { required: true, message: "Required field" },
                {
                  pattern: regexp.mobile,
                  message: "Please enter a valid mobile number!",
                },
              ]}
            >
              <Input allowClear />
            </Form.Item>
          </Col>
          <Col xs={24}>
            {[...Array(socialCount)].map((_, idx) => (
              <div key={Math.random() * idx}>
                <Row gutter={[16, 16]} align={"middle"}>
                  <Col xs={11}>
                    <Form.Item<FieldType>
                      label="Media Type"
                      name={`mediaType-${idx}`}
                      rules={[{ required: true, message: "Required field" }]}
                    >
                      <Input allowClear />
                    </Form.Item>
                  </Col>
                  <Col xs={11}>
                    <Form.Item<FieldType>
                      label="Profile URL"
                      name={`url-${idx}`}
                      rules={[
                        { required: true, message: "Required field" },
                        {
                          pattern: regexp.url,
                          message: "Please enter a valid url",
                        },
                      ]}
                    >
                      <Input allowClear />
                    </Form.Item>
                  </Col>
                  {[...Array(socialCount)].length - 1 === idx && (
                    <>
                      <Col xs={1}>
                        <Button
                          className="mt-1"
                          icon={<PlusOutlined />}
                          onClick={() => {
                            addRemoveSocial(true);
                          }}
                        />
                      </Col>
                      <Col xs={1}>
                        <Popconfirm
                          placement="right"
                          title={"Are you sure?"}
                          description={
                            "This action will result in deleting this content."
                          }
                          okText="Yes"
                          cancelText="No"
                          onConfirm={() => onConfirmDelete(idx)}
                        >
                          <Button
                            className="mt-1"
                            icon={<DeleteOutlined />}
                            disabled={socialCount <= 1}
                          />
                        </Popconfirm>
                      </Col>
                    </>
                  )}
                </Row>
              </div>
            ))}
          </Col>
          <Col xs={24}>
            <Form.Item<FieldType>
              label="Skills"
              name={`skills`}
              rules={[{ required: true, message: "Required field" }]}
            >
              <Select
                mode="multiple"
                allowClear
                style={{ width: "100%" }}
                placeholder="Please select"
                options={skills.map((x) => ({
                  label: x,
                  value: x.toLowerCase(),
                }))}
              />
            </Form.Item>
          </Col>
          <Col xs={24}>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="w-full"
                loading={loading}
                disabled={loading}
              >
                Submit
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default BasicDetails;
