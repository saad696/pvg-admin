import React, { useContext } from "react";
import { Drawer, Row, Col, Button } from "antd";
import { UserContext } from "../context/UserContext";
import { Link, useNavigate } from "react-router-dom";
import { sidebarMenus } from "../utils/constants";

interface props {
  open: boolean;
  onClose: () => void;
}

const BottomMenu: React.FC<props> = ({ open, onClose }) => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const sideMenu = sidebarMenus
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
          };
        }),
      };
    });

  return (
    <>
      <Drawer
        className="bottom-bar !bg-[#001529]"
        placement="bottom"
        closable={true}
        closeIcon={<></>}
        onClose={onClose}
        open={open}
        key={"bottom"}
        height={250}
      >
        <Row gutter={32}>
          {sideMenu.map((menu) => (
            <Col xs={6}>
              <h4 className="font-semibold text-gray-400">{menu.label}</h4>
              <div className="space-y-3 mt-2">
                {menu.children.map((subMenu) => (
                  <div>
                    <Link
                      onClick={onClose}
                      className="text-xs !text-gray-300"
                      to={subMenu.key}
                    >
                      {subMenu.label}
                    </Link>
                  </div>
                ))}
              </div>
            </Col>
          ))}
        </Row>
      </Drawer>
    </>
  );
};

export default BottomMenu;
