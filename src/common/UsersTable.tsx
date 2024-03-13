import React, { useContext, useEffect, useState } from 'react';
import { DataTable, ViewAction } from '..';
import { vikinFirebaseService } from '../services/firebase/vikinFirebaseService';
import { LoadingContext } from '../context/LoadingContext';
import { firebaseService } from '../services/firebase/firebaseService';
import { Badge, Tag } from 'antd';
import { helperService } from '../utils/helper';
import { dateTimeFormats } from '../utils/constants';

interface UsersTablePropsWithRide {
    getByRide: true;
    showFilters?: boolean;
    ridersId: string[];
    showExport?: boolean;
    showColumnsToggler?: boolean;
}

interface UsersTablePropsWithoutRide {
    getByRide: false;
    showFilters?: boolean;
    ridersId?: string[];
    showExport?: boolean;
    showColumnsToggler?: boolean;
}

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
        title: 'Emergency Number',
        dataIndex: 'emergency_number',
        key: 'emergency_number',
        hidden: true,
    },
    {
        title: 'Date Of Birth',
        dataIndex: 'dob',
        key: 'dob',
        render: (text: any) => (
            <p>
                {helperService.formatTime(false, dateTimeFormats.default, text)}
            </p>
        ),
        hidden: true,
    },
    {
        title: 'Blood Group',
        dataIndex: 'blood_group',
        key: 'blood_group',
        hidden: true,
    },
    {
        title: 'Joined At',
        dataIndex: 'joined_at',
        key: 'joined_at',
        hidden: true,
    },
    {
        title: 'Account Status',
        dataIndex: 'status',
        key: 'status',
        render: (status: boolean) => (
            <Tag color={status ? 'success' : 'red'}>
                {status ? 'Active' : 'Deactivated'}
            </Tag>
        ),
        hidden: true,
    },
    {
        title: 'Session Status',
        key: 'session_status',
        hidden: true,
        render: (_: any, record: IVikinRider) => (
            <Tag className='bg-transparent'>
                <Badge color={record.is_active ? 'green' : '#ccc'} />{' '}
                {record.is_active ? 'Online' : 'Offline'}
            </Tag>
        ),
    },
    {
        title: 'Actions',
        key: 'action',
        render: (_: any, record: IVikinRider) => (
            <ViewAction navigateTo={`/vikin/users/${record.user_id}`} />
        ),
    },
];

const UsersTable: React.FC<
    UsersTablePropsWithRide | UsersTablePropsWithoutRide
> = ({
    getByRide,
    ridersId,
    showFilters = true,
    showExport = true,
    showColumnsToggler = true,
}) => {
    const { setLoading } = useContext(LoadingContext);

    const [lastDoc, setLastDoc] = useState<IVikinRider | null>(null);
    const [pageSize, setPageSize] = useState(0);
    const [totalDocsCount, setTotalDocsCount] = useState<UserStatusCount>({
        count: 0,
        active: 0,
        deactivated: 0,
    });

    const getRiders = async (
        page: number,
        pageSize: number,
        statusFilter: string | undefined
    ) => {
        if (getByRide && ridersId.length) {
            const data = await vikinFirebaseService.getUsersByRide(
                ridersId,
                page,
                pageSize,
                lastDoc,
                setLoading
            );

            if (data) {
                setLastDoc(data.lastDoc);
                return data.users;
            } else {
                // Handle the case when result is undefined
                return [];
            }
        } else {
            const data = await vikinFirebaseService.getUsers(
                setLoading,
                page,
                pageSize,
                lastDoc,
                statusFilter
            );

            if (data) {
                setLastDoc(data.lastDoc);
                return data.users.map((x) => ({
                    ...x,
                    joined_at: helperService.formatTime(
                        true,
                        dateTimeFormats.default,
                        x.joined_at
                    ),
                }));
            } else {
                // Handle the case when result is undefined
                return [];
            }
        }
    };

    const getTotalDocsCount = async () => {
        const count = await firebaseService.getCount<UserStatusCount>(
            'users',
            'vikin'
        );

        if (count) {
            setTotalDocsCount({ ...count });
            setPageSize(count.count);
        }
    };

    useEffect(() => {
        getTotalDocsCount();
    }, []);

    return (
        <DataTable<IVikinRider>
            fetchData={getRiders}
            columns={tableColumns}
            totalDocs={pageSize}
            showColumnsToggler={showColumnsToggler}
            searchableColumns={['name']}
            expandableOptions={{
                expandedRowRender: () => <></>,
                rowExpandable: () => false,
            }}
            exportOptions={{ show: showExport, file_name: 'vikin_users_data' }}
            statusFilterOptions={{
                defaultFilter: 'all',
                filters: ['all', 'active', 'deactivated'],
                show: showFilters,
                onFilterChange(param: string) {
                    setPageSize(totalDocsCount[param as keyof UserStatusCount]);
                },
            }}
            counts={totalDocsCount as any}
        />
    );
};

export default UsersTable;
