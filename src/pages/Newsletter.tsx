import { Tag } from 'antd';
import { useContext, useState } from 'react';
import { PageTitle, DataTable } from '..';
import { LoadingContext } from '../context/LoadingContext';
import { dateTimeFormats } from '../utils/constants';
import { helperService } from '../utils/helper';
import { vikinFirebaseService } from '../services/firebase/vikinFirebaseService';

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
        title: 'Subscribed At',
        dataIndex: 'joined_at',
        key: 'joined_at',
        render: (text: Date) =>
            text ? (
                <p>
                    {helperService.formatTime(
                        false,
                        dateTimeFormats.default,
                        text.toString()
                    )}
                </p>
            ) : (
                <p>N/A</p>
            ),
    },
    {
        title: 'subscribed',
        dataIndex: 'subscribed',
        key: 'subscribed',
        render: (text: boolean) =>
            text ? <Tag color='success'>Yes</Tag> : <Tag color='red'>No</Tag>,
    },
];

const Newsletter = () => {
    const { setLoading } = useContext(LoadingContext);

    const [lastDoc, setLastDoc] = useState(null);
    const [totalDocsCount, setTotalDocsCount] = useState<number>(0);

    const [pageSize, setPageSize] = useState(0);

    const fetchData = async (page: number, pageSize: number) => {
        const result = await vikinFirebaseService.getNewsletterRegistrations(
            setLoading,
            page,
            pageSize,
            lastDoc
        );
        if (result) {
            setLastDoc(result.lastDoc);
            setTotalDocsCount(result.totalDocs);
            setPageSize(result.totalDocs);
            return result.users;
        } else {
            // Handle the case when result is undefined
            return [];
        }
    };
    return (
        <>
            <PageTitle title={`Vikin - Newsletter`} />
            {totalDocsCount && (
                <Tag color='#ffd60a' className='font-semibold !mb-4 '>
                    Total Subscriptions: {totalDocsCount}
                </Tag>
            )}
            <DataTable<Newsletter>
                fetchData={fetchData}
                columns={tableColumns}
                totalDocs={pageSize}
                searchableColumns={['name']}
                expandableOptions={{
                    expandedRowRender: () => <></>,
                    rowExpandable: () => false,
                }}
                exportOptions={{ show: false, file_name: `` }}
                statusFilterOptions={{
                    defaultFilter: '',
                    filters: [],
                    show: false,
                    onFilterChange() {},
                }}
                counts={totalDocsCount as any}
                showColumnsToggler={false}
            />
        </>
    );
};

export default Newsletter;
