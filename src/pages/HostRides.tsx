import React, { useContext, useState } from "react";

import {
  Form,
  Row,
  Col,
  Input,
  DatePicker,
  InputNumber,
  Tooltip,
  Select,
  Button,
} from "antd";
import {
  EyeOutlined,
  PlusOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { Editor, PageHeader } from "..";
import { useLocation } from "react-router-dom";
import { regexp, status } from "../utils/constants";
import { LoadingContext } from "../context/LoadingContext";
// @ts-ignore
import { v4 as uuidv4 } from "uuid";
import { UserContext } from "../context/UserContext";
import { vikinFirebaseService } from "../firebase/vikinFirebaseService";

type FieldType = {
  title: string;
  description: string;
  start_date: boolean;
  route: string;
  thumbnail: string;
  average_kilometers: number;
  is_published: boolean;
};

const HostRides = () => {
  const location = useLocation();
  const id = location.pathname.split("/")[1];
  const [hostRideForm] = Form.useForm();
  const { loading, setLoading } = useContext(LoadingContext);
  const { user } = useContext(UserContext);

  const [editorValue, setEditorValue] = useState<string>("");

  const onSubmit = async (values: IHostRideForm) => {
    const payload: IHostRide = {
      ...values,
      start_date: JSON.stringify(values.start_date),
      description: editorValue,
      status: status.ACTIVE,
      has_started: false,
      has_ended: false,
      users_joined: [],
      uuid: uuidv4(),
      createdAt: new Date(),
      createdBy: user.user.uid,
      updatedAt: new Date(),
      updatedBy: user.user.uid,
    };

    setLoading(true);
    await vikinFirebaseService.hostRide(payload, setLoading);
    hostRideForm.resetFields();
    setEditorValue("");
  };

  return (
    <>
      <PageHeader
        title={`${location.pathname.split("/")[1]} - Host Ride`}
        actions={[
          {
            name: "New Ride",
            visible: !!location.pathname.includes("edit"),
            icon: <PlusOutlined />,
            route: `/${id}/host-ride`,
          },
          {
            name: "View Rides",
            visible: true,
            icon: <EyeOutlined />,
            route: `/${id}/rides/listing`,
          },
        ]}
      />

      <Form
        name="create-user"
        onFinish={onSubmit}
        autoComplete="off"
        layout="vertical"
        form={hostRideForm}
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} md={6} lg={8}>
            <Form.Item<FieldType>
              label="Title"
              name="title"
              rules={[{ required: true, message: "Required field" }]}
            >
              <Input allowClear />
            </Form.Item>
          </Col>
          <Col xs={24} md={6} lg={8}>
            <Form.Item<FieldType>
              label="Thumbnail"
              name="thumbnail"
              rules={[
                { required: true, message: "Required field" },
                {
                  pattern: regexp.url,
                  message: "Please enter a valid url",
                },
              ]}
            >
              <Input
                suffix={
                  <Tooltip title="Enter image URL.">
                    <InfoCircleOutlined className="text-gray-500" />
                  </Tooltip>
                }
                allowClear
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={6} lg={8}>
            <Form.Item<FieldType>
              label="Start Date"
              name="start_date"
              rules={[{ required: true, message: "Required field" }]}
            >
              <DatePicker className="w-full" allowClear />
            </Form.Item>
          </Col>
          <Col xs={24} md={6} lg={8}>
            <Form.Item<FieldType>
              label="Ride Route"
              name="route"
              rules={[
                { required: true, message: "Required field" },
                {
                  pattern: regexp.url,
                  message: "Please enter a valid url",
                },
              ]}
            >
              <Input
                allowClear
                suffix={
                  <Tooltip title="Enter google maps link with all the stops in the journey route.">
                    <InfoCircleOutlined className="text-gray-500" />
                  </Tooltip>
                }
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={6} lg={8}>
            <Form.Item<FieldType>
              label="Average Kilometers"
              name="average_kilometers"
              rules={[{ required: true, message: "Required field" }]}
            >
              <InputNumber className="!w-full" />
            </Form.Item>
          </Col>
          <Col xs={24} md={6} lg={8}>
            <Form.Item<FieldType>
              label="Publish Ride"
              name="is_published"
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
          </Col>
          <Col xs={24}>
            <Form.Item label="Ride Description" required>
              <Editor getValue={setEditorValue} value={editorValue} />
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

export default HostRides;
