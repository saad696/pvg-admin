import { useContext, useState, useEffect } from "react";
import {
  Row,
  Col,
  Form,
  Input,
  Select,
  Button,
  DatePicker,
  message,
} from "antd";
import { EyeOutlined, PlusOutlined } from "@ant-design/icons";
import { Editor, PageHeader } from "..";
import { experienceFormOptions, skills, status } from "../utils/constants";
import { LoadingContext } from "../context/LoadingContext";

// @ts-ignore
import { v4 as uuidv4 } from "uuid";
import dayjs from "dayjs";
import { firebaseService } from "../firebase/firebaseService";
import { useLocation, useParams } from "react-router-dom";

type FieldType = {
  title: string;
  employment_type: string;
  company_name: string;
  location: string;
  location_type: string;
  currently_working: boolean;
  start_date: string | Date;
  end_date: string | Date;
  skills_used: string[];
};

const Experience = () => {
  const [experienceForm] = Form.useForm();
  const location = useLocation();
  const { id: expId } = useParams();
  const { loading, setLoading } = useContext(LoadingContext);

  const [editorValue, setEditorValue] = useState<string>("");
  const [isEndDateRequired, setIsEndDateRequired] = useState<boolean>(true);

  const getExperienceByIdAndSetForm = async () => {
    const data = await firebaseService.getExperienceById(expId as string);

    if (data) {
      setIsEndDateRequired(!!data.end_date);
      setEditorValue(data.description);
      experienceForm.setFieldsValue({
        title: data.title,
        employment_type: data.employment_type,
        company_name: data.company_name,
        location: data.location,
        location_type: data.location_type,
        currently_working: data.currently_working,
        start_date: dayjs(JSON.parse(data.start_date.toString())),
        end_date: data.end_date
          ? dayjs(JSON.parse(data.end_date.toString()))
          : "",
        skills_used: data.skills_used,
      });
    }
  };

  const onCurrentlyWorkingChange = (value: boolean) => {
    if (value) {
      setIsEndDateRequired(false);
      experienceForm.resetFields(["end_date"]);
    } else {
      setIsEndDateRequired(true);
    }
  };

  const onSubmit = async (values: IExperience) => {
    if (!editorValue) {
      return message.error("Please fill the job description field");
    }

    setLoading(true);

    const payload = {
      ...values,
      start_date: JSON.stringify(values.start_date),
      end_date: values.end_date ? JSON.stringify(values.end_date) : "",
      description: editorValue,
      status: status.ACTIVE,
    };

    if (location.pathname.includes("edit")) {
      await firebaseService.updateExperience(
        payload,
        expId as string,
        setLoading
      );
    } else {
      await firebaseService.postExperience(payload, uuidv4(), setLoading);
      // Reset logic
      experienceForm.resetFields();
      setEditorValue("");
      setIsEndDateRequired(true);
    }
  };

  useEffect(() => {
    if (location.pathname.includes("edit")) {
      getExperienceByIdAndSetForm();
    }
  }, []);

  return (
    <>
      <PageHeader
        title={`Portfolio - Experience`}
        actions={[
          {
            name: "New Experience",
            visible: !!location.pathname.includes("edit"),
            icon: <PlusOutlined />,
            route: `/portfolio/experience`,
          },
          {
            name: "View Experience",
            visible: true,
            icon: <EyeOutlined />,
            route: `/portfolio/experience/listing`,
          },
        ]}
      />
      <Form
        name="create-user"
        onFinish={onSubmit}
        autoComplete="off"
        layout="vertical"
        form={experienceForm}
      >
        <Row gutter={[16, 16]} align={"middle"}>
          <Col xs={24} md={12}>
            <Form.Item<FieldType>
              label="Job Title"
              name="title"
              rules={[{ required: true, message: "Required field" }]}
            >
              <Input allowClear />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item<FieldType>
              label="Company Name"
              name="company_name"
              rules={[{ required: true, message: "Required field" }]}
            >
              <Input allowClear />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item<FieldType>
              label="Employment Type"
              name={`employment_type`}
              rules={[{ required: true, message: "Required field" }]}
            >
              <Select
                allowClear
                style={{ width: "100%" }}
                placeholder="Please select"
                options={experienceFormOptions.employment_type.map((x) => ({
                  label: x,
                  value: x.toLowerCase(),
                }))}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item<FieldType>
              label="Location"
              name="location"
              rules={[{ required: true, message: "Required field" }]}
            >
              <Input allowClear />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item<FieldType>
              label="Location Type"
              name={`location_type`}
              rules={[{ required: true, message: "Required field" }]}
            >
              <Select
                allowClear
                style={{ width: "100%" }}
                placeholder="Please select"
                options={experienceFormOptions.location_type.map((x) => ({
                  label: x,
                  value: x.toLowerCase(),
                }))}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item<FieldType>
              label="Currently Working"
              name={`currently_working`}
              rules={[{ required: true, message: "Required field" }]}
            >
              <Select
                allowClear
                style={{ width: "100%" }}
                placeholder="Please select"
                onChange={onCurrentlyWorkingChange}
                options={[
                  {
                    label: "Yes",
                    value: true,
                  },
                  {
                    label: "No",
                    value: false,
                  },
                ]}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item<FieldType>
              label="Start Date"
              name={`start_date`}
              rules={[{ required: true, message: "Required field" }]}
            >
              <DatePicker className="w-full" picker="month" allowClear />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item<FieldType>
              label="End Date"
              name={`end_date`}
              rules={[
                { required: isEndDateRequired, message: "Required field" },
              ]}
            >
              <DatePicker
                disabled={!isEndDateRequired}
                className="w-full"
                picker="month"
                allowClear
              />
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item<FieldType>
              label="Skills Used"
              name={`skills_used`}
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
          <Col xs={24} className="!mb-8">
            <Form.Item label="Job Description" required>
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

export default Experience;
