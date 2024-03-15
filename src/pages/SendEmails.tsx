import { useContext, useEffect, useState } from 'react';
import { emailService } from '../services/elasticEmailService';
import { LoadingContext } from '../context/LoadingContext';
import parse from 'html-react-parser';
import { Editor, PageHeader } from '..';
import { BarChartOutlined, EyeOutlined } from '@ant-design/icons';
import {
    Button,
    Form,
    Input,
    Modal,
    Radio,
    RadioChangeEvent,
    Select,
    message,
} from 'antd';
import { tables, vikinEmailTypes } from '../utils/constants';
import { vikinFirebaseService } from '../services/firebase/vikinFirebaseService';
import { EmailMessageData } from '@elasticemail/elasticemail-client-ts-axios';
import { UserContext } from '../context/UserContext';

type FieldType = {
    subject: string;
    recipents: string[];
};

const SendEmails = () => {
    const { loading, setLoading } = useContext(LoadingContext);
    const { user } = useContext(UserContext);
    const [sendEmailForm] = Form.useForm();

    const [template, setTemplate] = useState<string>('');
    const [updatedTemplate, setUpdatedTemplate] = useState('');
    const [openPreviewModal, setOpenPreviewModal] = useState(false);
    const [recipents, setRecipents] = useState<string[]>([]);
    const [recipentsType, setRecipentsType] = useState<string>(
        tables.vikinUsers
    );

    const getTemplate = async () => {
        setLoading(true);
        const _template = await emailService.getEmailTemplates(
            setLoading,
            'vikin-custom'
        );

        if (_template) {
            setTemplate(_template[0].Content as string);
        }
    };

    const getEmails = async (type = tables.vikinUsers) => {
        const emails = await vikinFirebaseService.getEmails(setLoading, type);

        if (emails) {
            setRecipents([...emails]);
            sendEmailForm.setFieldValue('recipents', emails);
        }
    };

    const onRecipentsTypeChange = (e: RadioChangeEvent) => {
        setRecipentsType(e.target.value);
    };

    const onSubmit = async (values: FieldType) => {
        if (!updatedTemplate) {
            message.error('Please update email body!');
            return;
        }
        setLoading(true);
        const emailMessageData: EmailMessageData = {
            Recipients: values.recipents.map((email) => ({ Email: email })),
            Content: {
                Body: [
                    {
                        ContentType: 'HTML',
                        Charset: 'utf-8',
                        Content: updatedTemplate,
                    },
                ],
                EnvelopeFrom: 'Vikin <info@vikin.club>',
                From: 'Vikin <info@vikin.club>',
                Subject: values.subject,
            },
        };

        await emailService.sendBulkMail(
            setLoading,
            emailMessageData,
            vikinEmailTypes.custom,
            user.user.uid
        );
        sendEmailForm.resetFields();
        setUpdatedTemplate('');
    };

    useEffect(() => {
        getEmails(recipentsType);
    }, [recipentsType]);

    useEffect(() => {
        getTemplate();
    }, []);

    return (
        <>
            <PageHeader
                title={'Vikin - Send Emails'}
                actions={[
                    {
                        name: 'Preview',
                        visible: true,
                        icon: <EyeOutlined />,
                        onClick: () => setOpenPreviewModal(true),
                    },
                    {
                        name: 'Stats',
                        visible: true,
                        icon: <BarChartOutlined />,
                        route: '/vikin/email/stats',
                    },
                ]}
            />
            <div className='bg-gray-200 p-6 mb-6 space-y-4 rounded-md'>
                <h3>Select Recipents Type</h3>
                <Radio.Group
                    onChange={onRecipentsTypeChange}
                    value={recipentsType}
                >
                    <Radio value={tables.vikinUsers}>Users</Radio>
                    <Radio value={tables.newsletter}>Newsletter</Radio>
                </Radio.Group>
            </div>
            <Form
                name='send-mail'
                onFinish={onSubmit}
                autoComplete='off'
                layout='vertical'
                form={sendEmailForm}
            >
                <Form.Item<FieldType>
                    label='Recipents'
                    name='recipents'
                    rules={[{ required: true, message: 'Required field' }]}
                >
                    <Select
                        mode='multiple'
                        allowClear
                        style={{ width: '100%' }}
                        placeholder='Please select'
                        options={recipents.map((x) => ({
                            label: x,
                            value: x.toLowerCase(),
                        }))}
                    />
                </Form.Item>
                <Form.Item<FieldType>
                    label='Email Subject'
                    name='subject'
                    rules={[{ required: true, message: 'Required field' }]}
                >
                    <Input allowClear />
                </Form.Item>
                <Form.Item label='Email Body' required>
                    <Editor value={template} getValue={setUpdatedTemplate} />
                </Form.Item>
                <Button
                    type='primary'
                    htmlType='submit'
                    className='w-full my-8'
                    loading={loading}
                    disabled={loading}
                >
                    Send Mail
                </Button>
            </Form>

            <Modal
                title='Email Preview'
                open={openPreviewModal && !!updatedTemplate}
                onOk={() => {
                    setOpenPreviewModal(false);
                }}
                onCancel={() => {
                    setOpenPreviewModal(false);
                }}
                footer={null}
                className='!w-fit'
            >
                <div>
                    <p>Subject: {sendEmailForm.getFieldValue('subject')}</p>
                    <p>{parse(updatedTemplate)}</p>
                </div>
            </Modal>
            {/* {parse(updatedTemplate)} */}
        </>
    );
};

export default SendEmails;
