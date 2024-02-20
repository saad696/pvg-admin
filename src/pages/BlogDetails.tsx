import { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import parse from "html-react-parser";
import {
  Image,
  Typography,
  Tag,
  Row,
  Col,
  Button,
  Popconfirm,
  message,
} from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { firebaseService } from "../firebase/firebaseService";
import { LoadingContext } from "../context/LoadingContext";
import moment from "moment";
import { dateTimeFormats, status, tables, tagsColor } from "../utils/constants";

const BlogDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  const { setLoading } = useContext(LoadingContext);

  const [blog, setBlog] = useState<BlogDetails>();

  const getBlog = async () => {
    setLoading(true);
    const data = await firebaseService.getBlogById(
      id as string,
      location.pathname.split("/")[1],
      setLoading
    );

    if (data) {
      setBlog(data);
    }
  };

  const onConfirmDelete = async (uuid: string) => {
    setLoading(true);
    await firebaseService.deleteData(
      tables.blogs,
      location.pathname.split("/")[1],
      uuid,
      "blog",
      setLoading
    );
    await getBlog();
    navigate(`/${location.pathname.split("/")[1]}/blog/listing`);
    message.success("Deleted sucessfully");
  };

  useEffect(() => {
    getBlog();
  }, []);

  return (
    blog && (
      <>
        <div className="pb-16">
          <Typography.Title className="!my-6 text-justify lg:text-left !font-bold uppercase !text-2xl md:!text-3xl lg:!text-5xl !text-gray-600">
            {blog.title}
          </Typography.Title>
          <Row className="mb-6" justify={"space-between"}>
            <Col xs={24} md={12}>
              {blog.tags.map((tag) => (
                <Tag
                  key={tag}
                  color={
                    tagsColor[Math.floor(Math.random() * blog.tags.length)]
                  }
                >
                  {tag}
                </Tag>
              ))}
            </Col>
            <Col xs={24} md={12} className="text-left md:text-end !text-xl">
              <Typography className="mt-4 md:mb-2 text-left md:text-end !text-gray-400 font-semibold">
                Published{" "}
                {moment(blog.createAt).format(dateTimeFormats.default)}
              </Typography>
              {blog.status !== status.DELETED ? (
                <>
                  {blog.published ? (
                    <Tag color="green">Published</Tag>
                  ) : (
                    <Tag color="red">Not Published</Tag>
                  )}
                  {blog.feature ? (
                    <Tag color="green">Featured</Tag>
                  ) : (
                    <Tag color="red">Not Featured</Tag>
                  )}
                  <Popconfirm
                    placement="right"
                    title={"Are you sure?"}
                    description={
                      "This action will result in deleting this content."
                    }
                    okText="Yes"
                    cancelText="No"
                    onConfirm={() => onConfirmDelete(blog.uuid)}
                  >
                    <Button type="text">
                      <DeleteOutlined className="text-red-500" />
                    </Button>
                  </Popconfirm>
                </>
              ) : (
                <Tag color="red">Deleted</Tag>
              )}
            </Col>
          </Row>
          <Image src={blog.thumbnail.url} alt={blog.title} />
          <div className="mt-6 blog-content">{parse(blog.content)}</div>
        </div>
      </>
    )
  );
};

export default BlogDetails;
