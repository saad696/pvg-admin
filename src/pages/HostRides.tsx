import { useContext, useEffect, useState } from 'react';

import {
    Form,
    Row,
    Col,
    Input,
    DatePicker,
    InputNumber,
    Tooltip,
    Select,
    Button,
    Alert,
} from 'antd';
import {
    EyeOutlined,
    PlusOutlined,
    InfoCircleOutlined,
} from '@ant-design/icons';
import { Editor, PageHeader } from '..';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { regexp, rideStatuses, status, tables } from '../utils/constants';
import { LoadingContext } from '../context/LoadingContext';
import { v4 as uuidv4 } from 'uuid';
import { UserContext } from '../context/UserContext';
import { vikinFirebaseService } from '../services/firebase/vikinFirebaseService';
import dayjs from 'dayjs';

type FieldType = {
    title: string;
    description: string;
    start_date: boolean;
    route: string;
    thumbnail: string;
    average_kilometers: number;
    is_published: boolean;
    status?: string;
};

const HostRides = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { id: rideId } = useParams();
    const id = location.pathname.split('/')[1];
    const [hostRideForm] = Form.useForm();
    const { loading, setLoading } = useContext(LoadingContext);
    const { user } = useContext(UserContext);

    const [editorValue, setEditorValue] = useState<string>('');
    const [rideData, setRideData] = useState<IHostRide | null>(null);
    const [isCompleted, setIsCompleted] = useState(false);
    // const [openDrawer, setOpenDrawer] = useState<boolean>(false);

    const onSubmit = async (values: IHostRideForm) => {
        const payload: IHostRide = {
            ...values,
            start_date: JSON.stringify(values.start_date),
            description: editorValue,
            status:
                values.status || (status.ACTIVE.toLowerCase() as RideStatus),
            users_joined:
                rideData?.users_joined && rideData.users_joined.length
                    ? rideData.users_joined
                    : [],
            uuid: rideData?.uuid ? rideData.uuid : uuidv4(),
            createdAt: rideData?.createdAt ? rideData.createdAt : new Date(),
            createdBy: rideData?.createdBy ? rideData.createdBy : user.user.uid,
            updatedAt: new Date(),
            updatedBy: user.user.uid,
        };

        console.log('updated status: ', values.status);
        console.log('current status: ', rideData?.status);

        await vikinFirebaseService.updateRidesCount(
            tables.rides,
            rideData?.status || null,
            (values.status || status.ACTIVE.toLowerCase()) as RideStatus
        );

        setLoading(true);
        await vikinFirebaseService.hostRide(payload, setLoading, !!rideId);
        hostRideForm.resetFields();
        setEditorValue('');
        setTimeout(() => {
            navigate('/vikin/host-rides/listing');
        }, 600);
    };

    const fetchRideAndSetForm = async () => {
        setLoading(true);
        const data = await vikinFirebaseService.getRideById(
            setLoading,
            rideId as string
        );
        if (data) {
            setRideData(data);
            setEditorValue(data.description);
            hostRideForm.setFieldsValue({
                title: data.title,
                start_date: dayjs(JSON.parse(data.start_date.toString())),
                route: data.route,
                thumbnail: data.thumbnail,
                average_kilometers: data.average_kilometers,
                is_published: data.is_published,
                updatedAt: new Date(),
                updatedBy: user.user.uid,
                status: data.status,
            });
        }
    };

    useEffect(() => {
        if (rideId) {
            setIsCompleted(rideData?.status === 'completed');
        } else {
            setIsCompleted(false);
        }
    }, [rideData, rideId]);

    useEffect(() => {
        if (rideId) {
            fetchRideAndSetForm();
        } else {
            hostRideForm.resetFields();
            setEditorValue('');
        }
    }, [rideId]);

    return (
        <>
            {isCompleted && (
                <div className='mt-8'>
                    <Alert
                        className='font-semibold !text-green-500'
                        type='success'
                        message='Ride has been successfully completed!'
                    />
                </div>
            )}
            <PageHeader
                title={`${location.pathname.split('/')[1]} - ${
                    rideId ? 'Update' : 'Host'
                } Ride`}
                actions={[
                    {
                        name: 'New Ride',
                        visible: !!rideId,
                        icon: <PlusOutlined />,
                        route: `/${id}/host-rides`,
                    },
                    {
                        name: 'View Rides',
                        visible: true,
                        icon: <EyeOutlined />,
                        route: `/${id}/host-rides/listing`,
                    },
                    // {
                    //     name: 'View Riders',
                    //     visible: !!rideId,
                    //     icon: <TeamOutlined />,
                    //     onClick: () => setOpenDrawer(true),
                    // },
                ]}
            />

            <Form
                name='create-user'
                onFinish={onSubmit}
                autoComplete='off'
                layout='vertical'
                form={hostRideForm}
                disabled={isCompleted}
            >
                <Row gutter={[16, 16]}>
                    <Col xs={24} md={6} lg={8}>
                        <Form.Item<FieldType>
                            label='Title'
                            name='title'
                            rules={[
                                { required: true, message: 'Required field' },
                            ]}
                        >
                            <Input allowClear />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={6} lg={8}>
                        <Form.Item<FieldType>
                            label='Thumbnail'
                            name='thumbnail'
                            rules={[
                                { required: true, message: 'Required field' },
                                {
                                    pattern: regexp.url,
                                    message: 'Please enter a valid url',
                                },
                            ]}
                        >
                            <Input
                                suffix={
                                    <Tooltip title='Enter image URL.'>
                                        <InfoCircleOutlined className='text-gray-500' />
                                    </Tooltip>
                                }
                                allowClear
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={6} lg={8}>
                        <Form.Item<FieldType>
                            label='Start Date'
                            name='start_date'
                            rules={[
                                { required: true, message: 'Required field' },
                            ]}
                        >
                            <DatePicker className='w-full' allowClear />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={6} lg={8}>
                        <Form.Item<FieldType>
                            label='Ride Route'
                            name='route'
                            rules={[
                                { required: true, message: 'Required field' },
                                {
                                    pattern: regexp.url,
                                    message: 'Please enter a valid url',
                                },
                            ]}
                        >
                            <Input
                                allowClear
                                suffix={
                                    <Tooltip title='Enter google maps link with all the stops in the journey route.'>
                                        <InfoCircleOutlined className='text-gray-500' />
                                    </Tooltip>
                                }
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={6} lg={8}>
                        <Form.Item<FieldType>
                            label='Average Kilometers'
                            name='average_kilometers'
                            rules={[
                                { required: true, message: 'Required field' },
                            ]}
                        >
                            <InputNumber className='!w-full' />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={6} lg={8}>
                        <Form.Item<FieldType>
                            label='Publish Ride'
                            name='is_published'
                            rules={[
                                { required: true, message: 'Required field' },
                            ]}
                            initialValue={false}
                        >
                            <Select
                                allowClear
                                style={{ width: '100%' }}
                                placeholder='Please select'
                                options={[
                                    { label: 'Yes', value: true },
                                    { label: 'No', value: false },
                                ]}
                            />
                        </Form.Item>
                    </Col>
                    {rideId && (
                        <Col xs={24} md={6} lg={8}>
                            <Form.Item<FieldType>
                                label='Update Status'
                                name='status'
                                rules={[
                                    {
                                        required: !!rideId,
                                        message: 'Required field',
                                    },
                                ]}
                                initialValue={false}
                            >
                                <Select
                                    allowClear
                                    style={{ width: '100%' }}
                                    placeholder='Please select'
                                    options={rideStatuses.map((status) => ({
                                        label: status,
                                        value: status.toLowerCase(),
                                    }))}
                                />
                            </Form.Item>
                        </Col>
                    )}
                    <Col xs={24}>
                        <Form.Item label='Ride Description' required>
                            <Editor
                                getValue={setEditorValue}
                                value={editorValue}
                            />
                        </Form.Item>
                    </Col>

                    <Col xs={24}>
                        <Form.Item>
                            <Button
                                type='primary'
                                htmlType='submit'
                                className='w-full'
                                loading={loading}
                                disabled={loading || isCompleted}
                            >
                                Submit
                            </Button>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>

            {/* users drawer */}
            {/* <Drawer
                title='Joined Riders List'
                onClose={() => setOpenDrawer(false)}
                open={openDrawer}
            >
                {rideData ? (
                    <UsersTable
                        getByRide={true}
                        ridersId={rideData.users_joined.map(
                            (user) => user.user_id
                        )}
                        showFilters={false}
                    />
                ) : (
                    <Empty />
                )}
            </Drawer> */}
            {/* users drawer */}
        </>
    );
};

export default HostRides;
