import React from "react";
import { Card, Typography, Row, Col, Tag } from "antd";
import { useNavigate } from "react-router-dom";
import { tagsColor } from "../utils/constants";
import { BlogListCardActions } from "..";

interface Props {
  data: BlogDetails;
  pageId: string;
  onConfirmDelete: (uuid: string) => Promise<void>;
}

const BlogListCard: React.FC<Props> = ({ data, pageId, onConfirmDelete }) => {
  const navigate = useNavigate();

  return (
    <>
      <Card
        hoverable
        className="!mb-6"
        actions={[
          <BlogListCardActions {...{ data, pageId, onConfirmDelete }} />,
        ]}
        bodyStyle={{ padding: 0 }}
      >
        <div className="bg-blue-100 !border-t-2 !border-gray-500 flex justify-end p-2 mb-4 !space-x-2">
          {data.published ? (
            <Tag className="!m-0" color="green">
              Published
            </Tag>
          ) : (
            <Tag className="!m-0" color="red">
              Not Published
            </Tag>
          )}
          {data.feature ? (
            <Tag className="!m-0" color="green">
              Featured
            </Tag>
          ) : (
            <Tag className="!m-0" color="red">
              Not Featured
            </Tag>
          )}
        </div>
        <Row gutter={32} align={"middle"} className="p-2">
          <Col xs={24} lg={5}>
            <img
              src={data.thumbnail.url}
              height={200}
              className="w-full"
              alt={data.title}
            />
          </Col>
          <Col xs={24} lg={19} className="space-y-2">
            <Typography
              className="!text-xl font-bold !text-gray-500 hover:!text-blue-500 underline cursor-pointer"
              onClick={() => {
                navigate(`/${pageId}/blog/${data.uuid}`);
              }}
            >
              {data.title}
            </Typography>
            {data.tags.map((tag) => (
              <Tag
                key={tag}
                color={tagsColor[Math.floor(Math.random() * data.tags.length)]}
              >
                {tag}
              </Tag>
            ))}
            <Typography className="!text-gray-500">{data.summary}</Typography>
          </Col>
        </Row>
      </Card>
    </>
  );
};

export default BlogListCard;
