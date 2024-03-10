import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { LoadingContext } from '../context/LoadingContext';
import { vikinFirebaseService } from '../firebase/vikinFirebaseService';
import { PageHeader } from '..';
import parse from 'html-react-parser';
import { Collapse, Image, Tag } from 'antd';
import { dateTimeFormats, tagsColor } from '../utils/constants';
import { helperService } from '../utils/helper';
import { EditOutlined, ExportOutlined } from '@ant-design/icons';
import UsersTable from '../common/UsersTable';

const RideDetails = () => {
    const { id } = useParams();
    const { setLoading } = useContext(LoadingContext);

    const [rideDetails, setRideDetails] = useState<IHostRide | null>(null);

    const getRides = async () => {
        setLoading(true);
        const data = await vikinFirebaseService.getRideById(
            setLoading,
            id as string
        );

        if (data) {
            setRideDetails(data);
        } else {
            setRideDetails(null);
        }
    };

    const randomTagColor = (): string => {
        return tagsColor[Math.floor(Math.random() * 10)];
    };

    useEffect(() => {
        getRides();
    }, []);

    return (
        rideDetails && (
            <>
                <PageHeader
                    title={rideDetails.title}
                    actions={[
                        {
                            name: 'Edit',
                            visible: true,
                            icon: <EditOutlined />,
                            route: `/vikin/host-rides/${rideDetails.uuid}/edit`,
                        },
                    ]}
                />
                <Image
                    src={rideDetails.thumbnail}
                    alt={rideDetails.title + 'image'}
                />
                <div className='my-6 p-4 rounded-md shadow bg-slate-200 font-bold '>
                    <Tag color={randomTagColor()}>
                        Ride Date:{' '}
                        {helperService.formatTime(
                            false,
                            dateTimeFormats.default,
                            new Date(JSON.parse(rideDetails.start_date))
                        )}
                    </Tag>
                    <Tag color={randomTagColor()}>
                        Average Kilometers: {rideDetails.average_kilometers}
                    </Tag>
                    <Tag color={randomTagColor()}>
                        Status: {rideDetails.status}
                    </Tag>
                    <Tag color={randomTagColor()}>
                        Published: {rideDetails.is_published ? 'Yes' : 'No'}
                    </Tag>
                    <a href={rideDetails.route} target='_blank'>
                        <Tag color={randomTagColor()}>
                            View Route: <ExportOutlined />
                        </Tag>
                    </a>
                </div>
                <div className='mt-6 blog-content'>
                    {parse(rideDetails.description)}
                </div>

                <div className='my-6'>
                    <Collapse
                        items={[
                            {
                                key: '1',
                                label: <h1>View Registered Riders</h1>,
                                children: (
                                    <UsersTable
                                        getByRide={true}
                                        ridersId={rideDetails.users_joined.map(
                                            (user) => user.user_id
                                        )}
                                        showFilters={false}
                                    />
                                ),
                            },
                        ]}
                    />
                </div>
            </>
        )
    );
};

export default RideDetails;
