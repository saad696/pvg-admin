import React from "react";
import { Popconfirm, Button } from "antd";

interface ConfirmDeleteProps {
  title: string;
  description: string;
  onClick: () => any | void;
  disabled: boolean;
}

const ConfirmDelete: React.FC<ConfirmDeleteProps> = ({ onClick, disabled, title, description }) => {
  return (
    <>
      <Popconfirm
        title={title}
        description={description}
        disabled={disabled}
        onConfirm={onClick}
      >
        <Button
          size="small"
          type="primary"
          className="!bg-red-500 hover:!bg-red-600 disabled:!bg-gray-200"
          disabled={disabled}
        >
          Delete
        </Button>
      </Popconfirm>
    </>
  );
};

export default ConfirmDelete;
