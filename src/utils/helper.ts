import { auth } from "../firebase/firebase";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { utils, writeFile } from "xlsx";

import { ColumnsType } from "antd/es/table";
import { defaultRoute } from "./constants";

type ColumnType = {
  title: string;
  dataIndex: string;
};

export const helperService = {
  logout: () => {
    auth.signOut();
    sessionStorage.clear();
    location.assign(`${location.origin}/auth/login`);
  },
  defaultRoute: (role: string): string => {
    return role === "admin"
      ? "/portfolio/basic-details"
      : `${role}/${defaultRoute[role]}`;
  },
  removeRepeatingStrings: (input: string): string => {
    const tags = input.split(",").map((tag) => tag.trim());
    const uniqueTags = Array.from(new Set(tags));
    return uniqueTags.join(", ");
  },
  isObject: (val: any) => {
    if (val === null) {
      return false;
    }
    return typeof val === "function" || typeof val === "object";
  },
  exportPDF: (
    data: DataType[],
    columns: ColumnsType<any>,
    fileName: string
  ) => {
    const doc = new jsPDF();
    const tableColumnNames = columns.map((column) => column.title as string);
    const tableRows = data.map((row) =>
      // @ts-ignore
      columns.map((column) => row[column.dataIndex as string])
    );

    autoTable(doc, {
      head: [tableColumnNames],
      body: tableRows,
    });

    doc.save(`${fileName}.pdf`);
  },
  exportExcel: (data: DataType[], columns: ColumnType[], fileName: string) => {
    // Create a new data array with keys that match the column titles
    const newData = data.map((row) =>
      columns.reduce((newRow, column) => {
        newRow[column.title] = row[column.dataIndex];
        return newRow;
      }, {} as DataType)
    );

    // Create a worksheet
    const worksheet = utils.json_to_sheet(newData);

    // Set the column widths
    const wscols = columns.map(() => ({ wch: 20 }));
    worksheet["!cols"] = wscols;

    // Create a new workbook
    const workbook = utils.book_new();

    // Append the worksheet to the workbook
    utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // Write the workbook to a file and save
    writeFile(workbook, `${fileName}.xlsx`, {
      bookType: "xlsx",
      type: "array",
    });
  },
};
