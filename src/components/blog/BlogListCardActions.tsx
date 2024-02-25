import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Popconfirm } from "antd";
import { EditOutlined, EyeOutlined, DeleteOutlined } from "@ant-design/icons";
import { status } from "../../utils/constants";

interface Props {
  data: BlogDetails;
  pageId: string;
  onConfirmDelete: (uuid: string) => Promise<void>;
}

const BlogListCardActions: React.FC<Props> = ({
  data,
  pageId,
  onConfirmDelete,
}): ReactNode[] => {
  const navigate = useNavigate();
  const actions = [
    {
      visible: data.status === status.ACTIVE,
      element: (
        <Button
          className="!w-full"
          key={data.uuid + Math.random()}
          type="text"
          icon={<EditOutlined />}
          onClick={() => {
            navigate(`/${pageId}/blog/${data.uuid}/edit`);
          }}
        />
      ),
    },
    {
      visible: data.status === status.ACTIVE || data.status === status.DELETED,
      element: (
        <Button
          className="!w-full"
          key={data.uuid + Math.random()}
          type="text"
          icon={<EyeOutlined />}
          onClick={() => {
            navigate(`/${pageId}/blog/${data.uuid}`);
          }}
        />
      ),
    },
    {
      visible: data.status === status.ACTIVE,
      element: (
        <Popconfirm
          key={data.uuid + Math.random()}
          placement="right"
          title={"Are you sure?"}
          description={"This action will result in deleting this content."}
          okText="Yes"
          cancelText="No"
          onConfirm={() => onConfirmDelete(data.uuid)}
          className="w-full"
        >
          <Button className="!w-full" type="text">
            <DeleteOutlined />
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return actions.filter(({ visible }) => visible).map(({ element }) => element);
};

export default BlogListCardActions;
