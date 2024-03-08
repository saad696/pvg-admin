import { useContext, useEffect, useState } from "react";
import {
  Row,
  Col,
  Form,
  Input,
  Select,
  Button,
  DatePicker,
  Space,
  List,
  message,
  Tooltip,
} from "antd";
import { Editor, PageHeader, UploadFile } from "..";
import { useLocation, useParams } from "react-router-dom";
import { regexp, skills, status } from "../utils/constants";
import { LoadingContext } from "../context/LoadingContext";
import { firebaseService } from "../firebase/firebaseService";
// @ts-ignore
import { v4 as uuidv4 } from "uuid";
import {
  EyeOutlined,
  PlusOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

type FieldType = {
  name: string;
  thumbnail: string;
  duration: string;
  tech: string[];
  url: string;
  images: string;
};

const { RangePicker } = DatePicker;

const Projects = () => {
  const location = useLocation();
  const { id: projectId } = useParams();
  const { loading, setLoading } = useContext(LoadingContext);

  const id = location.pathname.split("/")[1];
  const [projectForm] = Form.useForm();

  const [editorValue, setEditorValue] = useState<string>("");
  const [uploadedFile, setUploadedFile] = useState<File | string>();
  const [projectImages, setProjectImages] = useState<string[]>([]);
  const [projectData, setProjectData] = useState<IProject | null>(null);

  const getImagedetails = (file: File) => {
    setUploadedFile(file);
  };

  const updateProject = async (data: IProject) => {
    await firebaseService.updateProject(data.uuid, id, setLoading, {
      ...data,
    });
  };

  const updateAfterThumbnailDelete = async () => {
    if (projectData) {
      await updateProject({ ...projectData, thumbnail: null });
      await fetchProjectAndSetForm();
    }
  };

  const addImageUrl = () => {
    const imageUrl = projectForm.getFieldValue("images");

    if (imageUrl && regexp.imageUrl.test(imageUrl)) {
      setProjectImages((prevValue) => [...prevValue, imageUrl]);
      projectForm.resetFields(["images"]);
    } else {
      message.error("Please enter a valid image URL.");
    }
  };

  const removeImageUrl = (idx: number) => {
    const arrayCopy = [...projectImages];
    arrayCopy.splice(idx, 1);
    setProjectImages([...arrayCopy]);
  };

  const fetchProjectAndSetForm = async () => {
    setLoading(true);

    const data = await firebaseService.getProjectById(
      projectId as string,
      id,
      setLoading
    );

    if (data) {
      const duration: string[] = JSON.parse(data.duration);
      projectForm.setFieldsValue({
        name: data.name,
        duration: [dayjs(duration[0]), dayjs(duration[1])],
        tech: data.tech,
        url: data.url,
      });

      setProjectData({
        ...data,
        thumbnail: {
          uid: "1",
          name: data.thumbnail?.path?.split("/")[1] || null,
          status: "done",
          url: data.thumbnail?.url || null,
          path: data.thumbnail?.path,
        },
      });
      setUploadedFile("N/A");
      setEditorValue(data.description);
      setProjectImages(data.images);
    }
  };

  const onSubmit = async (values: IProject) => {
    if (!uploadedFile) {
      return message.error("Please upload thumbnail.");
    }

    if (!editorValue) {
      return message.error("Please provide project description.");
    }

    setLoading(true);
    const payload = {
      ...values,
      duration: JSON.stringify(values.duration),
      images: [...projectImages],
      description: editorValue,
      thumbnail:
        uploadedFile === "N/A"
          ? {
              url: projectData?.thumbnail.url,
              path: projectData?.thumbnail.path,
            }
          : uploadedFile,
      uuid: projectData?.uuid || uuidv4(),
      status: status.ACTIVE,
    } as IProject;

    if (!location.pathname.includes("edit")) {
      await firebaseService.postProject(payload, id, setLoading);
      projectForm.resetFields();
      setProjectImages([]);
    } else {
      await updateProject(payload);
      await fetchProjectAndSetForm();
    }
  };

  useEffect(() => {
    if (location.pathname.includes("edit")) {
      fetchProjectAndSetForm();
    }
  }, []);

  return (
    <>
      <PageHeader
        title={`${id} - Project`}
        actions={[
          {
            name: "New Project",
            visible: !!location.pathname.includes("edit"),
            icon: <PlusOutlined />,
            route: `/${id}/blog`,
          },
          {
            name: "View Projects",
            visible: true,
            icon: <EyeOutlined />,
            route: `/${id}/project/listing`,
          },
        ]}
      />
      <Form
        name="create-user"
        onFinish={onSubmit}
        autoComplete="off"
        layout="vertical"
        form={projectForm}
      >
        <Row gutter={16}>
          <Col xs={24} lg={4}>
            <Form.Item<FieldType>
              label="Thumbnail"
              name="thumbnail"
              required={true}
            >
              <UploadFile
                onFileChange={getImagedetails}
                showCropper={true}
                uploadedFile={projectData?.thumbnail}
                afterImageClear={updateAfterThumbnailDelete}
              />
            </Form.Item>
          </Col>
          <Col xs={24} lg={20}>
            <Row gutter={[16, 16]} align={"middle"}>
              <Col xs={24} md={12}>
                <Form.Item<FieldType>
                  label="Project Name"
                  name="name"
                  rules={[{ required: true, message: "Required field" }]}
                >
                  <Input allowClear />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item<FieldType>
                  label="Project Duration"
                  name="duration"
                  rules={[{ required: true, message: "Required field" }]}
                >
                  <RangePicker className="w-full" picker="month" allowClear />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item<FieldType>
                  label="Technologies Used"
                  name={`tech`}
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
              <Col xs={24} md={12}>
                <Form.Item<FieldType>
                  label="Project URL"
                  name={`url`}
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
              <Col xs={24} className="!mb-8">
                <Form.Item label="Project Description" required>
                  <Editor getValue={setEditorValue} value={editorValue} />
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Form.Item<FieldType>
                  label="Add Images"
                  name="images"
                  rules={[
                    {
                      pattern: regexp.imageUrl,
                      message: "Please enter a valid image url",
                    },
                  ]}
                >
                  <Space.Compact style={{ width: "100%" }}>
                    <Input
                      allowClear
                      suffix={
                        <Tooltip title="Enter the link of the project and click add, to be shown in a carousel.">
                          <InfoCircleOutlined className="text-gray-500" />
                        </Tooltip>
                      }
                    />
                    <Button type="primary" onClick={addImageUrl}>
                      Add
                    </Button>
                  </Space.Compact>
                </Form.Item>

                <List
                  size="small"
                  header={<div>Added Image URL's</div>}
                  bordered
                  dataSource={projectImages}
                  renderItem={(url, idx) => (
                    <List.Item
                      actions={[
                        <Button
                          type="primary"
                          size="small"
                          className="!bg-red-500 hover:!bg-red-600"
                          onClick={() => removeImageUrl(idx)}
                        >
                          <DeleteOutlined />
                        </Button>,
                      ]}
                    >
                      {url}
                    </List.Item>
                  )}
                />
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
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default Projects;
