import React, { useContext } from "react";

import { Row, Col, Form, Input, Select, Button, message } from "antd";
import { LoadingContext } from "../context/LoadingContext";
import { roles } from "../utils/constants";
import { PageTitle } from "..";
import { firebaseService } from "../firebase/firebaseService";

type FieldType = {
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
};

const CreateUser = () => {
  const { loading, setLoading } = useContext(LoadingContext);

  const onSubmit = (data: CreateUserForm) => {
    if (data.password === data.confirmPassword) {
      setLoading(true);
      firebaseService.createUser({ ...data, setLoading });
    } else {
      message.error("Passwords does not match");
    }
  };

  return (
    <>
      <PageTitle title="Create User" />
      <Form
        name="create-user"
        onFinish={onSubmit}
        autoComplete="off"
        layout="vertical"
      >
        <Row>
          <Col xs={24}>
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
          <Col xs={24}>
            <Form.Item<FieldType>
              label="Password"
              name="password"
              rules={[{ required: true, message: "Required field" }]}
            >
              <Input.Password />
            </Form.Item>
          </Col>
          <Col xs={24}>
            <Form.Item<FieldType>
              label="Confirm Password"
              name="confirmPassword"
              rules={[{ required: true, message: "Required field" }]}
            >
              <Input.Password />
            </Form.Item>
          </Col>
          <Col xs={24}>
            <Form.Item<FieldType>
              label="Role"
              name="role"
              rules={[{ required: true, message: "Required field" }]}
              initialValue={roles[0].toLowerCase()}
            >
              <Select
                options={roles.map((role) => ({
                  value: role.toLowerCase(),
                  label: role,
                }))}
              />
            </Form.Item>
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
    </>
  );
};

export default CreateUser;
