import React, { useContext, useEffect, useState } from 'react';
import { DataTable, ViewAction } from '..';
import { vikinFirebaseService } from '../firebase/vikinFirebaseService';
import { LoadingContext } from '../context/LoadingContext';
import { firebaseService } from '../firebase/firebaseService';

interface UsersTablePropsWithRide {
    getByRide: true;
    showFilters: boolean;
    ridersId: string[];
}

interface UsersTablePropsWithoutRide {
    getByRide: false;
    showFilters: boolean;
    ridersId?: string[];
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
        title: 'Actions',
        key: 'action',
        render: (_: any, record: IVikinRider) => (
            <ViewAction navigateTo={`/vikin/users/${record.user_id}`} />
        ),
    },
];

const UsersTable: React.FC<
    UsersTablePropsWithRide | UsersTablePropsWithoutRide
> = ({ getByRide, showFilters, ridersId }) => {
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
                return data.users;
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
            searchableColumns={['name']}
            expandableOptions={{
                expandedRowRender: () => <></>,
                rowExpandable: () => false,
            }}
            exportOptions={{ show: false, file_name: '' }}
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
