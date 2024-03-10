import { useContext, useEffect, useState } from 'react';
import { LoadingContext } from '../context/LoadingContext';
import { vikinFirebaseService } from '../firebase/vikinFirebaseService';
import { dateTimeFormats, statusColor, tables } from '../utils/constants';
import { DataTable, PageTitle, ViewAction } from '..';
import { Timestamp } from 'firebase/firestore';
import { Tag } from 'antd';
import { firebaseService } from '../firebase/firebaseService';
import { helperService } from '../utils/helper';

const tableColumns = [
    {
        title: 'Title',
        dataIndex: 'title',
        key: 'title',
        width: 200,
    },
    {
        title: 'Average Kilometers',
        dataIndex: 'average_kilometers',
        key: 'average_kilometers',
        sorter: (a: any, b: any) =>
            a.average_kilometers.localeCompare(b.average_kilometers),
    },
    {
        title: 'Created At',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (date: Timestamp) =>
            helperService.formatTime(true, dateTimeFormats.default, date),
    },
    {
        title: 'Start Date',
        dataIndex: 'start_date',
        key: 'start_date',
        render: (date: string) => {
            return helperService.formatTime(
                false,
                dateTimeFormats.default,
                new Date(JSON.parse(date))
            );
        },
    },
    {
        title: 'Published',
        dataIndex: 'is_published',
        key: 'is_published',
        render: (text: boolean) =>
            text ? <Tag color='success'>Yes</Tag> : <Tag color='red'>No</Tag>,
    },
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: (text: string) => (
            <Tag color={statusColor[text.toUpperCase() as keyof status]}>
                {text}
            </Tag>
        ),
    },
    {
        title: 'View',
        key: 'view',
        render: (_: any, record: IHostRide) => (
            <ViewAction navigateTo={`/vikin/host-rides/view/${record.uuid}`} />
        ),
    },
];

const RidesListing = () => {
    const { setLoading } = useContext(LoadingContext);

    const [lastDoc, setLastDoc] = useState<IHostRide | null>(null);
    const [totalDocsCount, setTotalDocsCount] = useState<RideStatusCount>({
        count: 0,
        active: 0,
        inactive: 0,
        ongoing: 0,
        completed: 0,
        deleted: 0,
    });

    const [pageSize, setPageSize] = useState(0);

    const fetchData = async (
        page: number,
        pageSize: number,
        statusFilter: string | undefined
    ) => {
        setLoading(true);
        const data = await vikinFirebaseService.getRides(
            setLoading,
            page,
            pageSize,
            lastDoc,
            statusFilter
        );
        console.log(data);

        if (data) {
            setLastDoc(data.lastDoc);
            return data.rides;
        } else {
            // Handle the case when result is undefined
            return [];
        }
    };

    const getTotalDocsCount = async () => {
        const count = await firebaseService.getCount<RideStatusCount>(
            tables.rides,
            'vikin'
        );
        console.log('count: ', count);

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
            <PageTitle title={`Vikin - Rides Listing`} />
            <DataTable<IHostRide>
                fetchData={fetchData}
                columns={tableColumns}
                totalDocs={pageSize}
                searchableColumns={['title']}
                expandableOptions={{
                    expandedRowRender: () => <></>,
                    rowExpandable: () => false,
                }}
                exportOptions={{ show: false, file_name: '' }}
                statusFilterOptions={{
                    defaultFilter: 'all',
                    filters: [
                        'all',
                        'active',
                        'inactive',
                        'ongoing',
                        'completed',
                        'deleted',
                    ],
                    show: true,
                    onFilterChange(param: string) {
                        setPageSize(
                            totalDocsCount[param as keyof RideStatusCount]
                        );
                    },
                }}
                counts={totalDocsCount as any}
            />
        </>
    );
};

export default RidesListing;
