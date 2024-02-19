import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Layout, Button } from "antd";
import React, { useState } from "react";
import { helperService } from "../utils/helper";
import { BottomMenu, SideMenu } from "..";
import useWindowDimensions from "../hooks/use-window-dimensions";

const { Header, Sider, Content } = Layout;

interface props {
  children: React.ReactNode;
}

const MainLayout: React.FC<props> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { width } = useWindowDimensions();

  return (
    <>
      <Layout className="!min-h-screen overflow-y-hidden">
        {width > 576 && (
          <Sider trigger={null} collapsible collapsed={collapsed}>
            <SideMenu isCollapsed={collapsed} />
          </Sider>
        )}
        <Layout>
          <Header className="!pl-0 flex items-center justify-between">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              className="!h-[64px] !w-[64px] !rounded-none !text-white hover:!bg-gray-800"
            />

            <Button
              className="!bg-red-500 !text-white !font-semibold !border-none hover:!bg-red-600 !text-xs"
              onClick={() => helperService.logout()}
              icon={<LogoutOutlined />}
              size="small"
            >
              Logout
            </Button>
          </Header>
          <Content>
            <div className="container">{children}</div>
          </Content>
          {width < 576 && (
            <BottomMenu
              open={collapsed}
              onClose={() => {
                setCollapsed(!collapsed);
              }}
            />
          )}
        </Layout>
      </Layout>
    </>
  );
};

export default MainLayout;
