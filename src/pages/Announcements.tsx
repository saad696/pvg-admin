import { useContext, useEffect, useState } from 'react';
import { AnnouncementsList, PageTitle } from '..';
import { Button, Col, Divider, Form, Input, Row } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { LoadingContext } from '../context/LoadingContext';
import { v4 as uuidv4 } from 'uuid';
import { vikinFirebaseService } from '../services/firebase/vikinFirebaseService';
import { UserContext } from '../context/UserContext';

type FieldType = {
    title: string;
    message: string;
};

const Announcements = () => {
    const [announcementForm] = Form.useForm();
    const { loading, setLoading } = useContext(LoadingContext);
    const { user } = useContext(UserContext);
    const [data, setData] = useState<Announcement[]>([]);

    const onSubmit = async (values: Announcement) => {
        const payload: Announcement = {
            ...values,
            announcement_id: uuidv4(),
            announced_at: JSON.stringify(new Date()),
            announcement_by: user.user.uid,
        };

        await vikinFirebaseService.postAnnouncement(payload, setLoading);

        announcementForm.resetFields();
        await fetchData();
    };

    const fetchData = async () => {
        setLoading(true);
        const data = await vikinFirebaseService.getAnnouncementsList(
            setLoading
        );

        if (data) {
            setData([...data]);
        }
    };

    const deleteAnnouncement = async (announcementId: string) => {
        setLoading(true);
        await vikinFirebaseService.deleteAnnouncement(
            setLoading,
            announcementId
        );

        fetchData();
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <>
            <PageTitle title='Vikin - Announcements' />
            <Form
                name='annoucements'
                onFinish={onSubmit}
                autoComplete='off'
                layout='vertical'
                form={announcementForm}
            >
                <Row gutter={[16, 16]}>
                    <Col xs={24}>
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
                    <Col xs={24}>
                        <Form.Item<FieldType>
                            label='Message'
                            name='message'
                            rules={[
                                { required: true, message: 'Required field' },
                                {
                                    max: 1000,
                                    message: 'Character limit reached',
                                },
                            ]}
                        >
                            <TextArea allowClear showCount maxLength={1000} />
                        </Form.Item>
                    </Col>
                    <Col xs={24}>
                        <Button
                            type='primary'
                            htmlType='submit'
                            className='w-full'
                            loading={loading}
                            disabled={loading}
                        >
                            Submit
                        </Button>
                    </Col>
                </Row>
            </Form>
            <Divider />
            <AnnouncementsList
                data={data}
                deleteAnnouncement={deleteAnnouncement}
            />
        </>
    );
};

export default Announcements;
