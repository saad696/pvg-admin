import { Menu, MenuProps } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { sidebarMenus } from "../utils/constants";
import React, { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { helperService } from "../utils/helper";

interface props {
  isCollapsed: boolean;
}

const SideMenu: React.FC<props> = ({ isCollapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(UserContext);

  const sideMenu: MenuProps["items"] = sidebarMenus
    .filter((x) => x.visibility.includes(user.role))
    .map((x, index) => {
      const key = String(index + 1);
      return {
        key: `sub${key}`,
        icon: React.createElement(x.icon),
        label: x.name,

        children: x.children.map((y) => {
          return {
            key: y.path,
            label: y.name,
            onClick: () => navigate(y.path),
          };
        }),
      };
    });

  const defaultOpenMenu = (): string[] => {
    if (sessionStorage.getItem("lastVisitedRoute")?.includes("portfolio"))
      return ["sub1"];
    else if (sessionStorage.getItem("lastVisitedRoute")?.includes("vikin"))
      return ["sub2"];
    else if (sessionStorage.getItem("lastVisitedRoute")?.includes("graphyl"))
      return ["sub3"];
    else return ["sub4"];
  };

  return (
    <>
      <div
        className={`p-6 text-white text-2xl uppercase font-semibold ${
          isCollapsed && "text-center"
        }`}
      >
        {isCollapsed ? "A" : "Admin"}
      </div>
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={[
          sessionStorage.getItem("lastVisitedRoute") ||
            helperService.defaultRoute(user.role),
        ]}
        defaultOpenKeys={[...defaultOpenMenu()]}
        activeKey={location.pathname}
        items={sideMenu}
      />
    </>
  );
};

export default SideMenu;
