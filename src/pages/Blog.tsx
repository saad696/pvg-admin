import { useContext, useState, useEffect } from "react";

import { Form, Input, Row, Col, Button, Select, Card, message } from "antd";
import { EyeOutlined, PlusOutlined } from "@ant-design/icons";
import { Editor, UploadFile, PageHeader } from "..";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { LoadingContext } from "../context/LoadingContext";
import { UserContext } from "../context/UserContext";
import { firebaseService } from "../firebase/firebaseService";
// @ts-ignore
import { v4 as uuidv4 } from "uuid";
import { status } from "../utils/constants";

const { useForm } = Form;
const { TextArea } = Input;

type FieldType = {
  title: string;
  summary: string;
  published: boolean;
  feature: boolean;
  tags: string[];
  thumbnail: File;
};

const Blog = () => {
  const { loading, setLoading } = useContext(LoadingContext);
  const { user } = useContext(UserContext);

  const [blogForm] = useForm();
  const location = useLocation();
  const navigate = useNavigate();
  const { id: blogId } = useParams();

  const [editorValue, setEditorValue] = useState<string>("");
  const [tagsList, setTagsList] = useState<string[]>([]);
  const [uploadedFile, setUploadedFile] = useState<File | string>();
  const [blogDetails, setBlogDtails] = useState<BlogDetails | null>();

  const id = location.pathname.split("/")[1];

  const fetchTags = async () => {
    const data = await firebaseService.getTags(id);
    setTagsList(data ? data.tags : []);
  };

  const fetchBlogAndSetForm = async () => {
    setLoading(true);
    const data = await firebaseService.getBlogById(
      blogId as string,
      id,
      setLoading
    );

    if (data) {
      blogForm.setFieldsValue({
        title: data.title,
        summary: data.summary,
        published: data.published,
        feature: data.feature,
        tags: data.tags,
      });
      setBlogDtails({
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
      setEditorValue(data.content);
    }
  };

  const getImagedetails = (file: File) => {
    setUploadedFile(file);
  };

  const updateBlog = async (data: BlogDetails) => {
    await firebaseService.updateBlog(data.uuid, id, setLoading, {
      ...data,
    });
  };

  const updateAfterThumbnailDelete = async () => {
    if (blogDetails) {
      await updateBlog({ ...blogDetails, thumbnail: null });
      await fetchBlogAndSetForm();
    }
  };

  const onSubmit = async (values: BlogDetails) => {
    if (!uploadedFile) {
      return message.error("Please upload thumbnail.");
    }
    setLoading(true);
    const payload = {
      ...values,
      content: editorValue,
      createdAt: blogDetails?.createAt || new Date(),
      updatedAt: new Date(),
      createdBy: blogDetails?.createdBy || user.user.uid,
      updatedBy: user.user.uid,
      thumbnail:
        uploadedFile === "N/A"
          ? {
              url: blogDetails?.thumbnail.url,
              path: blogDetails?.thumbnail.path,
            }
          : uploadedFile,
      uuid: blogDetails?.uuid || uuidv4(),
      status: status.ACTIVE,
    };

    if (!location.pathname.includes("edit")) {
      await firebaseService.postBlog(payload, id, setLoading);
      blogForm.resetFields();
      setEditorValue("Start wrinting you blog...");
    } else {
      await updateBlog(payload);
      await fetchBlogAndSetForm();
    }
  };

  useEffect(() => {
    fetchTags();

    if (location.pathname.includes("edit")) {
      fetchBlogAndSetForm();
    } else {
      blogForm.resetFields();
      setEditorValue("Start wrinting you blog...");
      setBlogDtails(null);
    }
  }, [location.pathname]);

  return (
    <>
      <PageHeader
        title={`${location.pathname.split("/")[1]} - Blog`}
        actions={[
          {
            name: "New Blog",
            visible: !!location.pathname.includes("edit"),
            icon: <PlusOutlined />,
            route: `/${id}/blog`,
          },
          {
            name: "View Blogs",
            visible: true,
            icon: <EyeOutlined />,
            route: `/${id}/blog/listing`,
          },
        ]}
      />

      <Form
        name="create-user"
        onFinish={onSubmit}
        autoComplete="off"
        layout="vertical"
        form={blogForm}
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={16}>
            <Row gutter={[16, 16]}>
              <Col xs={24}>
                <Row gutter={[16, 16]} align={"middle"}>
                  <Col xs={24} lg={18}>
                    <Form.Item<FieldType>
                      label="Title"
                      name="title"
                      rules={[{ required: true, message: "Required field" }]}
                    >
                      <Input allowClear />
                    </Form.Item>

                    <Form.Item<FieldType>
                      label="Summary"
                      name="summary"
                      rules={[
                        { required: true, message: "Required field" },
                        { max: 250, message: "Characters limit exceeded" },
                      ]}
                    >
                      <TextArea showCount allowClear maxLength={250} />
                    </Form.Item>
                  </Col>
                  <Col xs={24} lg={6}>
                    <Form.Item<FieldType>
                      label="Thumbnail"
                      name="thumbnail"
                      required={true}
                    >
                      <UploadFile
                        onFileChange={getImagedetails}
                        showCropper={true}
                        uploadedFile={blogDetails?.thumbnail}
                        afterImageClear={updateAfterThumbnailDelete}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              <Col xs={24} className="!mb-8">
                <Form.Item label="Content" required>
                  <Editor getValue={setEditorValue} value={editorValue} />
                </Form.Item>
              </Col>
            </Row>
          </Col>
          <Col xs={24} lg={8} className="space-y-8">
            <Card className="shadow-lg">
              <div className="flex justify-between">
                <h2 className="mb-4 font-bold uppercase text-xl text-gray-500">
                  Link Tags
                </h2>
                <Button
                  type="link"
                  onClick={() => {
                    navigate("/create-tags");
                  }}
                >
                  Create Tags
                </Button>
              </div>
              <Form.Item<FieldType>
                name="tags"
                rules={[{ required: true, message: "Required field" }]}
              >
                <Select
                  mode="multiple"
                  allowClear
                  style={{ width: "100%" }}
                  placeholder="Please select"
                  options={tagsList?.map((tag) => ({ label: tag, value: tag }))}
                />
              </Form.Item>
            </Card>
            <Card className="shadow-lg">
              <h2 className="mb-4 font-bold uppercase text-xl text-gray-500">
                Publish Blog
              </h2>
              <Form.Item<FieldType>
                name="published"
                rules={[{ required: true, message: "Required field" }]}
                initialValue={false}
              >
                <Select
                  allowClear
                  style={{ width: "100%" }}
                  placeholder="Please select"
                  options={[
                    { label: "Yes", value: true },
                    { label: "No", value: false },
                  ]}
                />
              </Form.Item>
            </Card>
            <Card className="shadow-lg">
              <h2 className="mb-4 font-bold uppercase text-xl text-gray-500">
                Feature Blog
              </h2>
              <Form.Item<FieldType>
                name="feature"
                rules={[{ required: true, message: "Required field" }]}
                initialValue={false}
              >
                <Select
                  allowClear
                  style={{ width: "100%" }}
                  placeholder="Please select"
                  options={[
                    { label: "Yes", value: true },
                    { label: "No", value: false },
                  ]}
                />
              </Form.Item>
            </Card>
          </Col>
          <Col xs={24}>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="w-full mt-2"
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

export default Blog;
