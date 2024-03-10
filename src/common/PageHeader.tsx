import React, { ReactNode } from "react";
import { Row, Col, Button } from "antd";
import { PageTitle } from "..";
import { Link } from "react-router-dom";
import useWindowDimensions from "../hooks/use-window-dimensions";

type Action = {
  visible: boolean;
  name: string;
  icon: ReactNode;
  route?: string;
  onClick?: () => any;
};



interface PageHeaderProps {
  title: string;
  actions: Action[];
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, actions }) => {
  const { width } = useWindowDimensions();
  return (
    <>
      <Row>
        <Col xs={24} lg={18}>
          <PageTitle title={title} />
        </Col>
        <Col xs={24} lg={6} className="text-right mb-4 lg:my-auto">
          <div className="flex justify-end space-x-6">
            {actions.map((x) => (
              <span key={x.name}>
                {x.visible &&
                  (x.route ? (
                    <Link to={x.route}>
                      <Button
                        size={width < 768 ? "small" : "middle"}
                        icon={x.icon}
                        type="primary"
                        className="!text-xs md:text-base"
                        onClick={x.onClick}
                      >
                        {x.name}
                      </Button>
                    </Link>
                  ) : (
                    <Button
                      size={width < 768 ? "small" : "middle"}
                      icon={x.icon}
                      type="primary"
                      className="!text-xs md:text-base"
                      onClick={x.onClick}
                    >
                      {x.name}
                    </Button>
                  ))}
              </span>
            ))}
          </div>
        </Col>
      </Row>
    </>
  );
};

export default PageHeader;
