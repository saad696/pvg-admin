import React, { useContext, useState } from 'react';
import { DataTable, EmailStatsFilters, PageTitle } from '..';
import { vikinFirebaseService } from '../services/firebase/vikinFirebaseService';
import { LoadingContext } from '../context/LoadingContext';
import dayjs from 'dayjs';

const tableColumns = [
    {
        title: 'Subject',
        dataIndex: 'subject',
        key: 'subject',
    },
    {
        title: 'Email Type',
        dataIndex: 'email_type',
        key: 'email_type',
        render: (text: string) => <p className='capitalize'>{text}</p>,
    },
    {
        title: 'Message ID',
        dataIndex: 'MessageID',
        key: 'MessageID',
    },
    {
        title: 'Send Date',
        dataIndex: 'send_at',
        key: 'send_at',
        sorter: (a: EmailTransactions, b: EmailTransactions) => {
            return (
                dayjs(JSON.parse(a.send_at)).unix() -
                dayjs(JSON.parse(b.send_at)).unix()
            );
        },
        render: (date: string) =>
            new Date(JSON.parse(date)).toLocaleDateString(),
    },
];

const EmailStats = () => {
    const { setLoading } = useContext(LoadingContext);
    const [lastDoc, setLastDoc] = useState(null);
    const [totalDocsCount, setTotalDocsCount] = useState<number>(0);

    const [pageSize, setPageSize] = useState(0);

    const fetchData = async (page: number, pageSize: number) => {
        const result = await vikinFirebaseService.getEmailTransactions(
            setLoading,
            page,
            pageSize,
            lastDoc
        );
        if (result) {
            setLastDoc(result.lastDoc);
            setTotalDocsCount(result.totalDocs);
            setPageSize(result.totalDocs);
            return result.emailTransactions;
        } else {
            // Handle the case when result is undefined
            return [];
        }
    };
    return (
        <>
            <PageTitle title='Vikin - Email Stats' />
            <EmailStatsFilters />

            <div className='mt-8'>
                <h2>Email Transactions</h2>
                <DataTable<EmailTransactions>
                    fetchData={fetchData}
                    columns={tableColumns}
                    totalDocs={pageSize}
                    searchableColumns={['subject']}
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
            </div>
        </>
    );
};

export default EmailStats;
