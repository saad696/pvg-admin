import { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { DataTable, MarkAsReadAction, PageTitle } from '..';
import { LoadingContext } from '../context/LoadingContext';
import { firebaseService } from '../services/firebase/firebaseService';
import { dateTimeFormats } from '../utils/constants';
import { Typography } from 'antd';
import { helperService } from '../utils/helper';

const tableColumns = [
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        width: 200,
        sorter: (a: any, b: any) => a.name.localeCompare(b.name),
    },
    {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
    },
    {
        title: 'Mobile',
        dataIndex: 'mobile',
        key: 'mobile',
    },
    {
        title: 'Subject',
        dataIndex: 'subject',
        key: 'subject',
        hidden: true,
    },
    {
        title: 'Query',
        dataIndex: 'query',
        key: 'query',
        hidden: true,
    },
    {
        title: 'Recieved At',
        dataIndex: 'timestamp',
        key: 'timestamp',
    },
    {
        title: 'Action',
        key: 'action',
        render: (_: any, record: IContact) =>
            record.isRead ? <></> : <MarkAsReadAction data={record} />,
    },
];

const Contact = () => {
    const location = useLocation();
    const id = location.pathname.split('/')[1];
    const { setLoading } = useContext(LoadingContext);

    const [lastDoc, setLastDoc] = useState(null);
    const [totalDocsCount, setTotalDocsCount] = useState<{
        count: number;
        read: number;
        unread: number;
    }>({
        count: 0,
        read: 0,
        unread: 0,
    });

    const [pageSize, setPageSize] = useState(0);

    const fetchData = async (
        page: number,
        pageSize: number,
        statusFilter: string | undefined
    ) => {
        const result = await firebaseService.getContactDetails(
            id,
            setLoading,
            page,
            pageSize,
            lastDoc,
            statusFilter
        );
        if (result) {
            const updatedData = result.contacts.map((x) => ({
                ...x,
                timestamp: helperService.formatTime(
                    true,
                    dateTimeFormats.default,
                    x.timestamp
                ),
            }));

            setLastDoc(result.lastDoc);
            return updatedData;
        } else {
            // Handle the case when result is undefined
            return [];
        }
    };

    const getTotalDocsCount = async () => {
        const count = await firebaseService.getCount<{
            count: number;
            read: number;
            unread: number;
        }>('contacts', id);

        if (count) {
            setTotalDocsCount({ ...count });
            setPageSize(count.count);
        }
    };

    useEffect(() => {
        getTotalDocsCount();
    }, []);

    return (
        <>
            <PageTitle title={`${id} - Contacts`} />
            <DataTable<IContact>
                fetchData={fetchData}
                columns={tableColumns}
                totalDocs={pageSize}
                searchableColumns={['name']}
                expandableOptions={{
                    expandedRowRender: (record) => (
                        <div className='space-y-4'>
                            <Typography.Text>
                                <b className='block'>Subject: </b>
                                {record.subject}
                            </Typography.Text>
                            <Typography.Paragraph className='w-[600px]'>
                                <b className='block'>Query: </b>
                                {record.query}
                            </Typography.Paragraph>
                        </div>
                    ),
                    rowExpandable: (record) => record.name !== 'Not Expandable',
                }}
                exportOptions={{ show: true, file_name: `${id}-contacts` }}
                statusFilterOptions={{
                    defaultFilter: 'all',
                    filters: ['all', 'unread', 'read'],
                    show: true,
                    onFilterChange(param) {
                        if (param === 'read') {
                            setPageSize(totalDocsCount.read);
                        } else if (param === 'unread') {
                            setPageSize(totalDocsCount.unread);
                        } else {
                            setPageSize(totalDocsCount.count);
                        }
                    },
                }}
                counts={totalDocsCount as any}
            />
        </>
    );
};

export default Contact;
