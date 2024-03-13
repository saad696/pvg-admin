import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { vikinFirebaseService } from '../services/firebase/vikinFirebaseService';
import { LoadingContext } from '../context/LoadingContext';
import { Avatar, Badge, Card, Col, Collapse, Empty, Row, Tag } from 'antd';
import { helperService } from '../utils/helper';
import { PageHeader, RidesTable } from '..';
import { dateTimeFormats, tagsColor } from '../utils/constants';
import {
    ExportOutlined,
    PlayCircleOutlined,
    StopOutlined,
} from '@ant-design/icons';

const RegisteredUsersDetails = () => {
    const { id } = useParams();
    const { setLoading } = useContext(LoadingContext);

    const [userData, setUserData] = useState<IVikinRider | null>(null);
    const [color, setColor] = useState<{
        backgroundColor: string;
        color: string;
    }>({ backgroundColor: '', color: '' });

    const getUser = async () => {
        setLoading(true);
        const data = await vikinFirebaseService.getUserById(
            setLoading,
            id as string
        );

        if (data) {
            if (!data.profile_picture) {
                setColor(helperService.generateRandomColors(1).colorPair1);
            }
            setUserData(data);
        }
    };

    const randomTagColor = (): string => {
        return tagsColor[Math.floor(Math.random() * userData!.bikes.length)];
    };

    const changeUserStatus = async (status: boolean) => {
        setLoading(true);
        await vikinFirebaseService.changeUserStatus(
            setLoading,
            userData!.user_id,
            status
        );
        getUser();
    };

    useEffect(() => {
        getUser();
    }, []);

    return (
        <>
            <PageHeader
                title={'Vikin - User Details'}
                actions={[
                    {
                        name: userData?.status
                            ? 'Deactivate Account'
                            : 'Activate Account',
                        visible: true,
                        icon: userData?.status ? (
                            <StopOutlined />
                        ) : (
                            <PlayCircleOutlined />
                        ),
                        onClick: () => changeUserStatus(!userData?.status),
                        danger: userData?.status,
                    },
                ]}
            />
            {userData ? (
                <>
                    <Row
                        align={'middle'}
                        className='bg-white !border-[#e1e1e1] !border-[1px] rounded-md shadow-md p-6'
                    >
                        <Col
                            xs={24}
                            lg={3}
                            className='text-center lg:text-left'
                        >
                            {userData.profile_picture ? (
                                <Avatar
                                    size={100}
                                    src={userData.profile_picture}
                                />
                            ) : (
                                <Avatar
                                    size={80}
                                    className='!text-2xl font-semibold'
                                    style={color}
                                >
                                    {userData.name[0]}
                                </Avatar>
                            )}
                        </Col>
                        <Col
                            xs={24}
                            lg={18}
                            className='space-y-6 mt-6 lg:mt-0 text-center lg:text-left'
                        >
                            <div>
                                <h2 className='flex items-center justify-center lg:justify-start'>
                                    {userData.name}
                                    <Tag className='bg-transparent !ml-2'>
                                        <Badge
                                            color={
                                                userData.is_active
                                                    ? 'green'
                                                    : '#ccc'
                                            }
                                        />
                                        {userData.is_active
                                            ? 'Online'
                                            : 'Offline'}
                                    </Tag>
                                </h2>
                                <p>{userData.bio}</p>
                            </div>
                            <div>
                                <Tag color='green'>
                                    Joined Since:
                                    {helperService.formatTime(
                                        true,
                                        dateTimeFormats.default,
                                        userData.joined_at
                                    )}
                                </Tag>
                            </div>
                        </Col>
                        <Col
                            xs={24}
                            lg={3}
                            className='space-y-2 mt-6 lg:mt-0 text-center lg:text-right'
                        >
                            {Object.keys(userData.socials).map((key) => (
                                <a
                                    key={key}
                                    className='capitalize !text-black block'
                                    href={userData.socials[key]}
                                >
                                    {key} <ExportOutlined className='ml-2' />
                                </a>
                            ))}
                        </Col>
                    </Row>
                    <Row className='mt-6 space-y-6 lg:space-y-0' gutter={32}>
                        <Col xs={24} lg={12}>
                            <Card className='shadow-md text-center lg:text-left'>
                                <h3 className='mb-4'>Contact Details</h3>
                                <div>
                                    <b className='mr-2 underline  block lg:inline mb-2 lg:mb-0'>
                                        Email:
                                    </b>
                                    <a
                                        className='!text-black hover:!underline'
                                        href={`mailto:${userData.email}`}
                                    >
                                        {userData.email}
                                    </a>
                                </div>
                                <div>
                                    <b className='mr-2 underline  block lg:inline mb-2 lg:mb-0'>
                                        Mobile:
                                    </b>
                                    <a
                                        className='!text-black hover:!underline'
                                        href={`tel:${userData.mobile}`}
                                    >
                                        {userData.mobile}
                                    </a>
                                </div>
                                <div>
                                    <b className='mr-2 underline  block lg:inline mb-2 lg:mb-0'>
                                        Emergency Contact:
                                    </b>
                                    <a
                                        className='!text-black hover:!underline'
                                        href={`tel:${userData.emergency_number}`}
                                    >
                                        {userData.emergency_number}
                                    </a>
                                </div>
                            </Card>
                        </Col>
                        <Col xs={24} lg={12}>
                            <Card className='shadow-md text-center lg:text-left'>
                                <h3 className='mb-4'>Other Details</h3>
                                <div className='lg:flex lg:items-center'>
                                    <b className='mr-2 underline block lg:inline mb-2 lg:mb-0'>
                                        Blood Group:
                                    </b>
                                    <p>{userData.blood_group}</p>
                                </div>
                                <div className='lg:flex lg:items-center'>
                                    <b className='mr-2 underline block lg:inline mb-2 lg:mb-0'>
                                        Last Logged In:
                                    </b>
                                    <p>
                                        {helperService.formatTime(
                                            true,
                                            dateTimeFormats.default_with_time,
                                            userData.last_login
                                        )}
                                    </p>
                                </div>
                                <div className='lg:flex lg:items-center'>
                                    <b className='mr-2 underline block lg:inline mb-2 lg:mb-0'>
                                        Bikes Collection:
                                    </b>
                                    {userData.bikes.map((bike) =>
                                        bike.pet_name ? (
                                            <Tag
                                                color={randomTagColor()}
                                                className='mr-2'
                                            >
                                                {bike.name} AKA {bike.pet_name}
                                            </Tag>
                                        ) : (
                                            <Tag
                                                color={randomTagColor()}
                                                className='mr-2'
                                            >
                                                {bike.name}
                                            </Tag>
                                        )
                                    )}
                                </div>
                            </Card>
                        </Col>
                    </Row>
                    <div className='my-6'>
                        <Collapse
                            items={[
                                {
                                    key: '1',
                                    label: (
                                        <h1 className='text-xl md:text-3xl'>
                                            Participated In Rides
                                        </h1>
                                    ),
                                    children: (
                                        <RidesTable
                                            getByUser={true}
                                            rideIds={userData.rides_joined.map(
                                                (ride) => ride.ride_id
                                            )}
                                            showColumnsToggler={false}
                                            showExport={false}
                                            showFilters={false}
                                        />
                                    ),
                                },
                            ]}
                        />
                    </div>
                </>
            ) : (
                <Empty />
            )}
        </>
    );
};

export default RegisteredUsersDetails;
