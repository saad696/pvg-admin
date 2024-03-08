import React, { useState } from "react";
import {
  Card,
  Typography,
  Tag,
  Row,
  Col,
  Space,
  Button,
  Tooltip,
  Divider,
  Modal,
  Popconfirm,
} from "antd";
import {
  SolutionOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import parse from "html-react-parser";
import moment from "moment";
import { dateTimeFormats, status, tagsColor } from "../utils/constants";
import useWindowDimensions from "../hooks/use-window-dimensions";
import { useNavigate } from "react-router-dom";

interface ExperienceCardProps extends IExperience {
  onConfirmDelete: (uuid: string) => Promise<void>;
}

const ExperienceCard: React.FC<ExperienceCardProps> = (props) => {
  const { width } = useWindowDimensions();
  const navigate = useNavigate();

  const [openModal, setOpenModal] = useState<boolean>(false);

  return (
    <>
      <Card hoverable>
        <Row gutter={16}>
          <Col xs={24} md={22}>
            <Typography.Title className="!text-lg underline capitalize">
              {props.title}
            </Typography.Title>
            <Typography.Text className="capitalize !font-medium !text-gray-400 block">
              {props.company_name} . {props.employment_type}
            </Typography.Text>
            <Typography.Text className="capitalize !font-medium !text-gray-400 block">
              {props.location} . {props.location_type}
            </Typography.Text>
            <Typography.Text className="capitalize !font-medium !text-gray-400 block">
              {moment(JSON.parse(props.start_date.toString())).format(
                dateTimeFormats.month_year
              )}{" "}
              -{" "}
              {props.currently_working
                ? "Present"
                : moment(
                    JSON.parse(props.end_date ? props.end_date.toString() : "")
                  ).format(dateTimeFormats.month_year)}
            </Typography.Text>
            <Typography.Text className="flex items-center  mt-4">
              <SolutionOutlined className="md:!text-xl mr-2" />
              {props.skills_used.map((skill) => (
                <Tag
                  className="text-sm md:text-base"
                  key={skill}
                  color={
                    tagsColor[
                      Math.floor(Math.random() * props.skills_used.length)
                    ]
                  }
                >
                  {skill}
                </Tag>
              ))}
            </Typography.Text>
          </Col>
          <Col xs={24} md={2}>
            <div className="flex justify-center items-center h-full mt-6 lg:mt-0">
              <Space
                size={"large"}
                direction={width < 768 ? "horizontal" : "vertical"}
                split={width < 768 ? <Divider type="vertical" /> : ""}
              >
                <Tooltip title="View Description" placement="right">
                  <Button
                    type="text"
                    size={width < 768 ? "small" : "middle"}
                    icon={<EyeOutlined />}
                    onClick={() => setOpenModal(true)}
                  />
                </Tooltip>
                {props.status === status.ACTIVE && (
                  <>
                    <Button
                      type="text"
                      size={width < 768 ? "small" : "middle"}
                      icon={<EditOutlined />}
                      onClick={() =>
                        navigate(`/portfolio/experience/${props.uuid}/edit`)
                      }
                    />
                    <Popconfirm
                      placement="right"
                      title={"Are you sure?"}
                      description={
                        "This action will result in deleting this content."
                      }
                      okText="Yes"
                      cancelText="No"
                      onConfirm={() => props.onConfirmDelete(props.uuid)}
                      className="w-full"
                    >
                      <Button
                        type="text"
                        size={width < 768 ? "small" : "middle"}
                        icon={<DeleteOutlined />}
                      />
                    </Popconfirm>
                  </>
                )}
              </Space>
            </div>
          </Col>
        </Row>
      </Card>

      {/* description modal */}
      <Modal
        title="Job Description"
        open={openModal}
        onOk={() => setOpenModal(false)}
        onCancel={() => setOpenModal(false)}
      >
        <div className="blog-content">{parse(props.description)}</div>
      </Modal>
      {/* description modal */}
    </>
  );
};

export default ExperienceCard;
