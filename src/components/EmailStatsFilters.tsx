import { Col, DatePicker, Button, Card, Statistic, Form, Row } from 'antd';
import dayjs from 'dayjs';
import React, { useContext, useEffect, useState } from 'react';
import { emailService } from '../services/elasticEmailService';
import { dateTimeFormats } from '../utils/constants';
import { LoadingContext } from '../context/LoadingContext';
import { LogStatusSummary } from '@elasticemail/elasticemail-client-ts-axios';
import CountUp from 'react-countup';
import { Formatter } from 'antd/es/statistic/utils';

type FieldType = {
    from: string;
    to: string;
};

const formatter = (value: number) => <CountUp end={value} separator=',' />;

const EmailStatsFilters = () => {
    const [statsFilterForm] = Form.useForm();
    const { loading, setLoading } = useContext(LoadingContext);

    const [stats, setStats] = useState<LogStatusSummary | null>(null);

    const getStats = async (
        from: string = '2024-3-1',
        to: string | undefined = undefined
    ) => {
        setLoading(true);
        const data = await emailService.getStats(
            setLoading,
            dayjs(from).format(dateTimeFormats.elastic_format),
            dayjs(to).format(dateTimeFormats.elastic_format)
        );
        if (data) {
            setStats(data);
        }
    };

    const onFilter = async (values: FieldType) => {
        getStats(values.from, values.to);
    };

    const onResetFilter = async () => {
        statsFilterForm.resetFields();
        statsFilterForm.setFieldValue('from', dayjs('2024-3-1'));
        getStats();
    };

    useEffect(() => {
        getStats();
    }, []);
    return (
        <>
            <div>
                <h3>Select Range</h3>
                <Form
                    name='stats-filter'
                    onFinish={onFilter}
                    autoComplete='off'
                    layout='vertical'
                    form={statsFilterForm}
                    className='!mt-4'
                >
                    <Row gutter={[16, 16]} align={'middle'}>
                        <Col xs={12} md={8} lg={4}>
                            <Form.Item<FieldType>
                                name='from'
                                rules={[
                                    {
                                        required: true,
                                        message: 'Required field',
                                    },
                                ]}
                            >
                                <DatePicker
                                    defaultValue={dayjs('2024-3-1')}
                                    placeholder='From Date'
                                    allowClear
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={12} md={8} lg={4}>
                            <Form.Item<FieldType> name='to'>
                                <DatePicker placeholder='To Date' allowClear />
                            </Form.Item>
                        </Col>
                        <Col xs={12} md={4} lg={2}>
                            <Button
                                className='mb-6 w-full'
                                type='primary'
                                htmlType='submit'
                            >
                                Filter
                            </Button>
                        </Col>
                        <Col xs={12} md={4} lg={2}>
                            <Button
                                className='mb-6 w-full'
                                danger
                                onClick={onResetFilter}
                            >
                                Reset
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </div>
            <div>
                <Row gutter={[8, 8]}>
                    <Col xs={8} md={6} lg={3}>
                        <Card bordered={false}>
                            <Statistic
                                loading={loading}
                                title={
                                    <small className='font-semibold'>
                                        Recipents
                                    </small>
                                }
                                value={stats?.Recipients}
                                precision={2}
                                formatter={formatter as Formatter}
                            />
                        </Card>
                    </Col>
                    <Col xs={8} md={6} lg={3}>
                        <Card bordered={false}>
                            <Statistic
                                loading={loading}
                                title={
                                    <small className='font-semibold'>
                                        Total Emails
                                    </small>
                                }
                                value={stats?.EmailTotal}
                                precision={2}
                                formatter={formatter as Formatter}
                            />
                        </Card>
                    </Col>
                    <Col xs={8} md={6} lg={3}>
                        <Card bordered={false}>
                            <Statistic
                                loading={loading}
                                title={
                                    <small className='font-semibold'>
                                        Delivered
                                    </small>
                                }
                                value={stats?.Delivered}
                                precision={2}
                                formatter={formatter as Formatter}
                            />
                        </Card>
                    </Col>
                    <Col xs={8} md={6} lg={3}>
                        <Card bordered={false}>
                            <Statistic
                                loading={loading}
                                title={
                                    <small className='font-semibold'>
                                        Bounced
                                    </small>
                                }
                                value={stats?.Bounced}
                                precision={2}
                                formatter={formatter as Formatter}
                            />
                        </Card>
                    </Col>
                    <Col xs={8} md={6} lg={3}>
                        <Card bordered={false}>
                            <Statistic
                                loading={loading}
                                title={
                                    <small className='font-semibold'>
                                        In Progress
                                    </small>
                                }
                                value={stats?.InProgress}
                                precision={2}
                                formatter={formatter as Formatter}
                            />
                        </Card>
                    </Col>
                    <Col xs={8} md={6} lg={3}>
                        <Card bordered={false}>
                            <Statistic
                                loading={loading}
                                title={
                                    <small className='font-semibold'>
                                        Opened
                                    </small>
                                }
                                value={stats?.Opened}
                                precision={2}
                                formatter={formatter as Formatter}
                            />
                        </Card>
                    </Col>
                    <Col xs={8} md={6} lg={3}>
                        <Card bordered={false}>
                            <Statistic
                                loading={loading}
                                title={
                                    <small className='font-semibold'>
                                        Clicked
                                    </small>
                                }
                                value={stats?.Clicked}
                                precision={2}
                                formatter={formatter as Formatter}
                            />
                        </Card>
                    </Col>
                    <Col xs={8} md={6} lg={3}>
                        <Card bordered={false}>
                            <Statistic
                                loading={loading}
                                title={
                                    <small className='font-semibold'>
                                        Unsubscribed
                                    </small>
                                }
                                value={stats?.Unsubscribed}
                                precision={2}
                                formatter={formatter as Formatter}
                            />
                        </Card>
                    </Col>
                    <Col xs={8} md={6} lg={3}>
                        <Card bordered={false}>
                            <Statistic
                                loading={loading}
                                title={
                                    <small className='font-semibold'>
                                        Inbounds
                                    </small>
                                }
                                value={stats?.Inbound}
                                precision={2}
                                formatter={formatter as Formatter}
                            />
                        </Card>
                    </Col>
                    <Col xs={8} md={6} lg={3}>
                        <Card bordered={false}>
                            <Statistic
                                loading={loading}
                                title={
                                    <small className='font-semibold'>
                                        Not Delivered
                                    </small>
                                }
                                value={stats?.NotDelivered}
                                precision={2}
                                formatter={formatter as Formatter}
                            />
                        </Card>
                    </Col>
                    <Col xs={8} md={6} lg={3}>
                        <Card bordered={false}>
                            <Statistic
                                loading={loading}
                                title={
                                    <small className='font-semibold'>
                                        Complaints
                                    </small>
                                }
                                value={stats?.Complaints}
                                precision={2}
                                formatter={formatter as Formatter}
                            />
                        </Card>
                    </Col>
                </Row>
            </div>
        </>
    );
};

export default EmailStatsFilters;
