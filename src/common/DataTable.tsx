import React, { useState, useEffect, useRef } from 'react';
import {
    Table,
    Input,
    Button,
    Space,
    Row,
    Col,
    Select,
    Tag,
    Dropdown,
    MenuProps,
    Checkbox,
    CheckboxProps,
} from 'antd';
import type {
    FilterDropdownProps,
    ExpandableConfig,
} from 'antd/es/table/interface';
import {
    EllipsisOutlined,
    SearchOutlined,
    SettingOutlined,
} from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { Export } from '..';

type ColumnsType<T> = {
    hidden: any;
    title: string;
    dataIndex: string;
    key: string;
    render?: (text: string, record: T, index: number) => React.ReactNode;
}[];

interface DataTableProps<T> {
    columns: ColumnsType<T> | any;
    fetchData: (
        page: number,
        pageSize: number,
        statusFilter: string | undefined
    ) => Promise<T[]>;
    searchableColumns: string[];
    expandableOptions: ExpandableConfig<T>;
    exportOptions: { show: boolean; file_name: string };
    totalDocs: number;
    showColumnsToggler?: boolean;
    counts: { [key: string]: number };
    statusFilterOptions: {
        show: boolean;
        filters: string[];
        defaultFilter: string;
        onFilterChange: (param: any) => any;
    };
}

const DataTable = <T extends Record<string, any>>({
    columns,
    fetchData,
    searchableColumns,
    expandableOptions,
    exportOptions,
    statusFilterOptions,
    totalDocs,
    counts,
    showColumnsToggler = true,
}: DataTableProps<T>) => {
    const [statusFilterValue, setStatusFilterValue] = useState<string>(
        statusFilterOptions.defaultFilter || ''
    );
    const [data, setData] = useState<T[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [tableKey, setTableKey] = useState(Math.random());
    const searchInput = useRef<any>(null);
    const [checkedList, setCheckedList] = useState<string[]>([]);
    const [openColumnDropdown, setOpenColumnDropdown] =
        useState<boolean>(false);

    const fetch = async () => {
        setLoading(true);
        const newData = await fetchData(
            currentPage,
            pageSize,
            statusFilterOptions ? statusFilterValue : undefined
        );
        setData(newData);
        setLoading(false);
    };

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
        setSearchText('');
        setSelectedKeys([]);
        setSearchedColumn('');
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
                    onPressEnter={() =>
                        handleSearch(selectedKeys, confirm, dataIndex)
                    }
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type='primary'
                        onClick={() =>
                            handleSearch(selectedKeys, confirm, dataIndex)
                        }
                        icon={<SearchOutlined />}
                        size='small'
                        style={{ width: 90 }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() =>
                            clearFilters &&
                            handleReset(clearFilters, setSelectedKeys)
                        }
                        size='small'
                        style={{ width: 90 }}
                    >
                        Reset
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered: boolean) => (
            <SearchOutlined
                style={{ color: filtered ? '#1890ff' : undefined }}
            />
        ),
        onFilter: (value: any, record: T) =>
            record[dataIndex]
                ? record[dataIndex]
                      .toString()
                      .toLowerCase()
                      .includes(value.toString().toLowerCase())
                : '',

        render: (text: string) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });

    const newColumns: ColumnsType<T> = columns.map((col: any) => ({
        ...col,
        ...(searchableColumns.includes(col.dataIndex)
            ? getColumnSearchProps(col.dataIndex)
            : {}),
        hidden: !checkedList.includes(col.key as string),
    }));

    const onStatusFilterChange = (filterValue: string) => {
        setStatusFilterValue(filterValue);
        statusFilterOptions.onFilterChange(filterValue);
    };

    const onColumnsChange: CheckboxProps['onChange'] = (e) => {
        const value = e.target.value;
        const isChecked = e.target.checked;

        setCheckedList((prevState) => {
            if (!isChecked) {
                return prevState.filter((x) => x !== value);
            } else {
                return [...prevState, value];
            }
        });
    };

    useEffect(() => {
        setCheckedList(
            (
                columns.map((item: any) =>
                    !item.hidden ? item.key : null
                ) as []
            ).filter((item) => item)
        );
    }, [columns]);

    useEffect(() => {
        fetch();
    }, [
        currentPage,
        pageSize,
        statusFilterOptions ? statusFilterValue : undefined,
    ]);

    return (
        <>
            <Row className='mb-4' align={'bottom'} gutter={[16, 16]}>
                <Col lg={exportOptions.show && showColumnsToggler ? 15 : 19}>
                    {statusFilterOptions.show &&
                        statusFilterOptions.filters.length && (
                            <>
                                <h3>Filter By Status</h3>
                                <Select
                                    defaultValue={
                                        statusFilterOptions.filters[0]
                                    }
                                    onChange={(value) =>
                                        onStatusFilterChange(value)
                                    }
                                    style={{ width: 220 }}
                                    options={statusFilterOptions.filters.map(
                                        (filter) => ({
                                            label: (
                                                <p className='capitalize'>
                                                    {filter} -{' '}
                                                    <Tag color='red'>
                                                        {counts[
                                                            filter === 'all'
                                                                ? 'count'
                                                                : filter
                                                        ] || 0}
                                                    </Tag>
                                                </p>
                                            ),
                                            value: filter,
                                        })
                                    )}
                                />
                            </>
                        )}
                </Col>
                {showColumnsToggler && (
                    <Col lg={5} className='flex justify-end'>
                        <Dropdown.Button
                            open={openColumnDropdown}
                            icon={
                                <EllipsisOutlined
                                    onClick={() => {
                                        setOpenColumnDropdown(
                                            (prevState) => !prevState
                                        );
                                    }}
                                />
                            }
                            menu={{
                                items: newColumns.map((col) => ({
                                    label: (
                                        <Checkbox
                                            disabled={col.key === 'action'}
                                            checked={!col.hidden}
                                            value={col.key}
                                            onChange={onColumnsChange}
                                        >
                                            {col.title}
                                        </Checkbox>
                                    ),
                                    key: col.key,
                                })) as MenuProps['items'],
                            }}
                            trigger={['click']}
                        >
                            Manage Columns
                            <SettingOutlined />
                        </Dropdown.Button>
                    </Col>
                )}
                {exportOptions.show && (
                    <Col lg={4} className='flex justify-end'>
                        <Export
                            data={data}
                            columns={columns}
                            fileName={exportOptions.file_name}
                        />
                    </Col>
                )}
            </Row>
            <Table<T>
                key={tableKey}
                dataSource={data}
                columns={newColumns}
                rowKey={(data) => data.uuid}
                pagination={{
                    current: currentPage,
                    pageSize,
                    total: totalDocs,
                    showSizeChanger: true,
                    pageSizeOptions: [
                        '5',
                        '10',
                        '15',
                        '20',
                        '25',
                        '30',
                        '40',
                        '50',
                    ],
                }}
                loading={loading}
                onChange={handleTableChange}
                scroll={{ x: 'max-content' }}
                expandable={expandableOptions}
            />
        </>
    );
};

export default DataTable;
