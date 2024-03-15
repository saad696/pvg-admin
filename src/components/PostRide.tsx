import React, { useContext, useEffect, useState } from 'react';
import { regexp } from '../utils/constants';
import { PlusOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import {
    Col,
    Input,
    Button,
    Popconfirm,
    Form,
    Row,
    message,
    Modal,
    Image,
} from 'antd';
import { LoadingContext } from '../context/LoadingContext';
import { useParams } from 'react-router-dom';
import { vikinFirebaseService } from '../services/firebase/vikinFirebaseService';

type FieldType = {
    [key: string]: string | string[];
};

interface PostRideProps {
    rideTitle: string;
}

const PostRide: React.FC<PostRideProps> = ({ rideTitle }) => {
    const { id } = useParams();
    const [rideImageForm] = Form.useForm();
    const { loading, setLoading } = useContext(LoadingContext);

    const [imageCount, setImageCount] = useState(1);
    const [viewRideImage, setViewRideImage] = useState('');

    const addRemoveImage = (add: boolean): void => {
        if (add && imageCount >= 6) {
            message.info('Maximum of 6 images can be uploaded per ride!');
            return;
        }

        setImageCount((prevState) => (add ? prevState + 1 : prevState - 1));
    };

    const onConfirmDelete = () => {
        addRemoveImage(false);
    };

    const viewImage = (fieldName: string) => {
        const url = rideImageForm.getFieldValue(fieldName);

        if (url) {
            setViewRideImage(rideImageForm.getFieldValue(fieldName));
        } else {
            message.error('No image uploaded yet!');
        }
    };

    const getImages = async () => {
        const images = await vikinFirebaseService.getPostRideImages(
            setLoading,
            id as string
        );

        if (images && images.length) {
            setImageCount(
                images.length >= 6 ? images.length : images.length + 1
            );
            images.forEach((image, idx) => {
                rideImageForm.setFieldValue(`iamgeUrl-${idx + 1}`, image);
            });
        }
    };

    const onSubmit = async (values: FieldType) => {
        await vikinFirebaseService.uploadPostRideImages(
            setLoading,
            Object.values(values) as string[],
            id as string
        );
        rideImageForm.resetFields();
        getImages();
    };

    useEffect(() => {
        getImages();
    }, []);

    return (
        <>
            <h2 className='inline-block bg-yellow-400 text-white px-2 py-1 rounded-md my-8 text-base md:text-xl'>
                Upload {rideTitle} Images
            </h2>
            <Form
                name='create-user'
                onFinish={onSubmit}
                autoComplete='off'
                layout='vertical'
                form={rideImageForm}
            >
                {[...Array(imageCount)].map((_, idx) => (
                    <div key={Math.random() * idx}>
                        <Row gutter={[16, 16]} align={'middle'}>
                            <Col xs={22}>
                                <Form.Item<FieldType>
                                    label={`Ride Image ${idx + 1}`}
                                    name={`iamgeUrl-${idx + 1}`}
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Required field',
                                        },
                                        {
                                            pattern: regexp.url,
                                            message: 'Please enter a valid url',
                                        },
                                    ]}
                                >
                                    <Input
                                        allowClear
                                        suffix={
                                            <EyeOutlined
                                                onClick={() => {
                                                    viewImage(
                                                        `iamgeUrl-${idx + 1}`
                                                    );
                                                }}
                                            />
                                        }
                                    />
                                </Form.Item>
                            </Col>
                            {[...Array(imageCount)].length - 1 === idx && (
                                <>
                                    {idx < 5 && (
                                        <Col xs={1}>
                                            <Button
                                                className='mt-1'
                                                icon={<PlusOutlined />}
                                                onClick={() => {
                                                    addRemoveImage(true);
                                                }}
                                            />
                                        </Col>
                                    )}
                                    <Col xs={1}>
                                        <Popconfirm
                                            placement='right'
                                            title={'Are you sure?'}
                                            description={
                                                'This action will result in deleting this content.'
                                            }
                                            okText='Yes'
                                            cancelText='No'
                                            onConfirm={() => onConfirmDelete()}
                                        >
                                            <Button
                                                className='mt-1'
                                                icon={<DeleteOutlined />}
                                                disabled={imageCount <= 1}
                                            />
                                        </Popconfirm>
                                    </Col>
                                </>
                            )}
                        </Row>
                    </div>
                ))}

                <Button
                    type='primary'
                    htmlType='submit'
                    className='w-full'
                    loading={loading}
                    disabled={loading}
                >
                    Submit
                </Button>
            </Form>

            {/* Image Modal */}
            <Modal
                footer={null}
                open={!!viewRideImage}
                onCancel={() => {
                    setViewRideImage('');
                }}
                className='w-fit'
            >
                <Image src={viewRideImage} alt={`${rideTitle}-image`} />
            </Modal>
            {/* Image Modal */}
        </>
    );
};

export default PostRide;
