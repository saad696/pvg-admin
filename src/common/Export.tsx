import React from "react";
import type { MenuProps } from "antd";
import { Button, Dropdown, Flex } from "antd";
import { helperService } from "../utils/helper";

interface ExportProps {
  data: any;
  columns: any;
  fileName: string
}

const items = [
  {
    key: "pdf",
    label: "PDF",
  },
  {
    key: "xlsx",
    label: "XLSX",
  },
];

const Export: React.FC<ExportProps> = ({ data, columns, fileName }) => {
  const onMenuClick: MenuProps["onClick"] = (e) => {
    const key = e.key;

    switch (key) {
      case "pdf":
        helperService.exportPDF(data, columns, fileName);
        break;
      case "xlsx":
        helperService.exportExcel(data, columns, fileName);
        break;

      default:
        break;
    }
  };

  return (
    <>
      <Dropdown.Button className="flex justify-end mb-4" type="primary" menu={{ items, onClick: onMenuClick }}>
        Export as
      </Dropdown.Button>
    </>
  );
};

export default Export;
