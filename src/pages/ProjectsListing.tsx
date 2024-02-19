import { CaretRightOutlined } from "@ant-design/icons";
import type { CSSProperties } from "react";
import React, { useContext, useEffect, useState } from "react";
import type { CollapseProps } from "antd";
import {
  Collapse,
  theme,
  Typography,
  Empty,
  Button,
  Space,
  Divider,
  Popconfirm,
  Image,
  Tabs,
  message,
} from "antd";
import { LinkOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import parse from "html-react-parser";
import { LoadingContext } from "../context/LoadingContext";
import { firebaseService } from "../firebase/firebaseService";
import { NavigateFunction, useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import { PageTitle } from "..";
import { dateTimeFormats, status, tables } from "../utils/constants";

const getItems: (
  panelStyle: CSSProperties,
  data: IProject[],
  onConfirmDelete: (uuid: string) => Promise<any>,
  id: string,
  navigate: NavigateFunction
) => CollapseProps["items"] = (
  panelStyle,
  data,
  onConfirmDelete,
  id,
  navigate
) => {
  return data.map((data, idx) => {
    return {
      key: data.uuid,
      label: (
        <div className="flex justify-between items-center">
          <Typography className="!text-xs lg:!text-base font-bold capitalize">
            {idx + 1} - {data.name}
          </Typography>
          <Typography className="!text-xs font-semibold !text-gray-400 lg:hidden">
            {moment(JSON.parse(data.duration)[0].$d).format(dateTimeFormats.month_year)} -
            {moment(JSON.parse(data.duration)[1].$d).format(dateTimeFormats.month_year)}
          </Typography>
          <Space
            className="!hidden lg:!flex"
            split={<Divider type="vertical" />}
          >
            <Typography className="font-semibold !text-gray-400">
              {moment(JSON.parse(data.duration)[0].$d).format(dateTimeFormats.month_year)} -
              {moment(JSON.parse(data.duration)[1].$d).format(dateTimeFormats.month_year)}
            </Typography>
            <Button type="text" href={data.url} target="_blank">
              <LinkOutlined />
            </Button>
            {data.status !== status.DELETED && (
              <>
                <Button
                  type="text"
                  onClick={() => {
                    navigate(`/${id}/project/${data.uuid}/edit`);
                  }}
                >
                  <EditOutlined />
                </Button>
                <Popconfirm
                  placement="right"
                  title={"Are you sure?"}
                  description={
                    "This action will result in deleting this content."
                  }
                  okText="Yes"
                  cancelText="No"
                  onConfirm={() => onConfirmDelete(data.uuid)}
                >
                  <Button type="text">
                    <DeleteOutlined />
                  </Button>
                </Popconfirm>
              </>
            )}
          </Space>
        </div>
      ),
      children: (
        <div className="h-[450px] overflow-y-auto">
          {data.images && data.images.length ? (
            <Image.PreviewGroup items={[...data.images]}>
              <Image width={300} src={data.thumbnail.url} />
            </Image.PreviewGroup>
          ) : (
            <Image width={300} src={data.thumbnail.url} />
          )}
          <div className="flex justify-end lg:hidden  mt-2">
            <Space split={<Divider type="vertical" />}>
              <Button size="small" type="text" href={data.url} target="_blank">
                <LinkOutlined className="!text-xs" />
              </Button>
              {data.status !== status.DELETED && (
                <>
                  <Button
                    type="text"
                    onClick={() => {
                      navigate(`/${id}/project/${data.uuid}/edit`);
                    }}
                  >
                    <EditOutlined />
                  </Button>
                  <Popconfirm
                    placement="right"
                    title={"Are you sure?"}
                    description={
                      "This action will result in deleting this content."
                    }
                    okText="Yes"
                    cancelText="No"
                    onConfirm={() => onConfirmDelete(data.uuid)}
                  >
                    <Button size="small" type="text">
                      <DeleteOutlined className="!text-xs" />
                    </Button>
                  </Popconfirm>
                </>
              )}
            </Space>
          </div>
          <div className="mt-6 blog-content">{parse(data.description)}</div>
        </div>
      ),
      style: panelStyle,
    };
  });
};

const ProjectsListing = () => {
  const { token } = theme.useToken();
  const { setLoading } = useContext(LoadingContext);
  const location = useLocation();
  const navigate = useNavigate();

  const id = location.pathname.split("/")[1];

  const panelStyle: React.CSSProperties = {
    marginBottom: 24,
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: "none",
  };

  const [projects, setProjects] = useState<IProject[]>([]);
  const [projectsStatusBased, setProjectsStatusBased] = useState<IProject[]>(
    []
  );

  const getProjects = async (_status = status.DELETED) => {
    setLoading(true);
    const data = await firebaseService.getProjects(id, setLoading);
    if (data && data.project.length) {
      setProjects(data.project);
      setProjectsStatusBased(
        projects.filter((x) => x.status === status.ACTIVE)
      );
    }
  };

  const onConfirmDelete = async (uuid: string) => {
    setLoading(true);
    await firebaseService.deleteData(
      tables.project,
      id,
      uuid,
      "project",
      setLoading
    );
    await getProjects();
    message.success("Deleted sucessfully");
  };

  const onTabsChange = (key: string) => {
    setProjectsStatusBased(projects.filter((x) => x.status === key));
  };

  useEffect(() => {
    getProjects();
  }, []);

  return (
    <>
      <PageTitle
        title={`${location.pathname.split("/")[1]} - Project Listing`}
      />
      <Tabs
        className="w-full"
        defaultActiveKey={status.ACTIVE}
        onChange={onTabsChange}
        type="card"
        items={[status.ACTIVE, status.DELETED].map((_status) => ({
          label: _status,
          key: _status,
          tabKey: _status,
          children: projectsStatusBased.length ? (
            <Collapse
              bordered={false}
              expandIconPosition="end"
              expandIcon={({ isActive }) => (
                <CaretRightOutlined rotate={isActive ? 90 : 0} />
              )}
              style={{ background: token.colorBgContainer }}
              items={getItems(
                panelStyle,
                projectsStatusBased,
                onConfirmDelete,
                id,
                navigate
              )}
            />
          ) : (
            <Empty />
          ),
        }))}
      />
    </>
  );
};

export default ProjectsListing;
