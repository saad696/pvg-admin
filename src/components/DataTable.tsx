import React, { useState, useEffect, useRef } from "react";
import { Table, Input, Button, Space } from "antd";
import type { FilterDropdownProps } from "antd/es/table/interface";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";

type ColumnsType<T> = {
  title: string;
  dataIndex: string;
  key: string;
  render?: (text: string, record: T, index: number) => React.ReactNode;
}[];

interface DataTableProps<T> {
  columns: ColumnsType<T>;
  fetchData: (page: number, pageSize: number) => Promise<T[]>;
  searchableColumns: string[];
}

const DataTable = <T extends Record<string, any>>({
  columns,
  fetchData,
  searchableColumns,
}: DataTableProps<T>) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [tableKey, setTableKey] = useState(Math.random());
  const searchInput = useRef<any>(null);

  const fetch = async () => {
    setLoading(true);
    const newData = await fetchData(currentPage, pageSize);
    setData(newData);
    setLoading(false);
  };

  useEffect(() => {
    fetch();
  }, [currentPage, pageSize]);

  const handleTableChange = (pagination: any) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  const handleSearch = (
    selectedKeys: React.Key[],
    confirm: () => void,
    dataIndex: string
  ) => {
    confirm();
    setSearchText(selectedKeys[0] as string);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (
    clearFilters: () => void,
    setSelectedKeys: (selectedKeys: React.Key[]) => void
  ) => {
    clearFilters();
    setSearchText("");
    setSelectedKeys([]);
    setSearchedColumn("");
    setTableKey(Math.random());
  };

  const getColumnSearchProps = (dataIndex: string) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }: FilterDropdownProps) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() =>
              clearFilters && handleReset(clearFilters, setSelectedKeys)
            }
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value: any, record: T) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toString().toLowerCase())
        : "",

    render: (text: string) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const newColumns = columns.map((col) => ({
    ...col,
    ...(searchableColumns.includes(col.dataIndex)
      ? getColumnSearchProps(col.dataIndex)
      : {}),
  }));

  return (
    <Table<T>
      key={tableKey}
      dataSource={data}
      columns={newColumns}
      rowKey={(data) => data.uuid}
      pagination={{
        current: currentPage,
        pageSize,
        total: data.length,
        showSizeChanger: true,
        pageSizeOptions: ["5", "10", "15", "20", "25", "30", "40", "50"],
      }}
      loading={loading}
      onChange={handleTableChange}
    />
  );
};

export default DataTable;
