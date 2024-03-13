import React, { useContext, useEffect, useState } from 'react';
import { DataTable, ViewAction } from '..';
import { LoadingContext } from '../context/LoadingContext';
import { firebaseService } from '../services/firebase/firebaseService';
import { vikinFirebaseService } from '../services/firebase/vikinFirebaseService';
import { dateTimeFormats, statusColor, tables } from '../utils/constants';
import { Tag } from 'antd';
import { Timestamp } from 'firebase/firestore';
import { helperService } from '../utils/helper';
import { useParams } from 'react-router-dom';
import { ColumnsType } from 'antd/es/table';

interface RideTablePropsWithRide {
    getByUser: true;
    rideIds: string[];
    showExport?: boolean;
    showColumnsToggler?: boolean;
    showFilters?: boolean;
}

interface RideTablePropsWithoutRide {
    getByUser: false;
    rideIds?: string[];
    showExport?: boolean;
    showColumnsToggler?: boolean;
    showFilters?: boolean;
}

const initialColumns: ColumnsType<IHostRide> = [
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
            <Tag
                className='capitalize'
                color={statusColor[text.toUpperCase() as keyof status]}
            >
                {text}
            </Tag>
        ),
    },
    {
        title: 'Actions',
        key: 'action',
        hidden: false,
        render: (_: any, record: IHostRide) => (
            <div>
                <ViewAction
                    navigateTo={`/vikin/host-rides/view/${record.uuid}`}
                />
                <ViewAction
                    isEdit={true}
                    navigateTo={`/vikin/host-rides/${record.uuid}/edit`}
                />
            </div>
        ),
    },
];

const RidesTable: React.FC<
    RideTablePropsWithRide | RideTablePropsWithoutRide
> = ({
    rideIds,
    getByUser = false,
    showColumnsToggler = true,
    showExport = true,
    showFilters = true,
}) => {
    const { id: user_id } = useParams();
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
    const [tableColumns, setTableColumns] = useState(initialColumns);

    const fetchData = async (
        page: number,
        pageSize: number,
        statusFilter: string | undefined
    ) => {
        setLoading(true);
        if (getByUser && rideIds?.length) {
            const data = await vikinFirebaseService.getRideByUsers(
                rideIds,
                page,
                pageSize,
                lastDoc,
                setLoading
            );

            if (data) {
                setLastDoc(data.lastDoc);
                return data.rides;
            } else {
                // Handle the case when result is undefined
                return [];
            }
        } else {
            const data = await vikinFirebaseService.getRides(
                setLoading,
                page,
                pageSize,
                lastDoc,
                statusFilter
            );

            if (data) {
                setLastDoc(data.lastDoc);
                return data.rides;
            } else {
                // Handle the case when result is undefined
                return [];
            }
        }
    };

    const getTotalDocsCount = async () => {
        const count = await firebaseService.getCount<RideStatusCount>(
            tables.rides,
            'vikin'
        );

        if (count) {
            setTotalDocsCount({ ...count });
            setPageSize(count.count);
        }
    };

    useEffect(() => {
        if (user_id) {
            const newTableColumns = [...tableColumns];
            newTableColumns.splice(newTableColumns.length - 2, 0, {
                title: 'Joined At',
                dataIndex: 'users_joined',
                key: 'users_joined',
                render: (
                    users_joined: { user_id: string; joined_at: Date }[]
                ) => {
                    const user = users_joined.find(
                        (x) => x.user_id === user_id
                    );
                    return user
                        ? helperService.formatTime(
                              true,
                              dateTimeFormats.default_with_time,
                              user.joined_at
                          )
                        : 'N/A';
                },
            });

            setTableColumns(newTableColumns);
        }
    }, [user_id]);

    useEffect(() => {
        getTotalDocsCount();
    }, []);
    return (
        <>
            <DataTable<IHostRide>
                fetchData={fetchData}
                columns={tableColumns}
                totalDocs={pageSize}
                searchableColumns={['title']}
                expandableOptions={{
                    expandedRowRender: () => <></>,
                    rowExpandable: () => false,
                }}
                exportOptions={{ show: showExport, file_name: '' }}
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
                    show: showFilters,
                    onFilterChange(param: string) {
                        setPageSize(
                            totalDocsCount[param as keyof RideStatusCount]
                        );
                    },
                }}
                counts={totalDocsCount as any}
                showColumnsToggler={showColumnsToggler}
            />
        </>
    );
};

export default RidesTable;
