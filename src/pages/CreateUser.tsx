import { useContext, useState } from 'react';

import { Row, Col, Form, Input, Select, Button, message } from 'antd';
import { LoadingContext } from '../context/LoadingContext';
import { roles, subRoles } from '../utils/constants';
import { PageTitle } from '..';
import { firebaseService } from '../services/firebase/firebaseService';

type FieldType = {
    email: string;
    password: string;
    confirmPassword: string;
    role: string;
    subRole: string;
};

const CreateUser = () => {
    const [userForm] = Form.useForm();
    const { loading, setLoading } = useContext(LoadingContext);

    const [mainRole, setMainRole] = useState<string>('');

    const onRoleChange = (value: string) => setMainRole(value);

    const onSubmit = (data: CreateUserForm) => {
        if (data.password === data.confirmPassword) {
            setLoading(true);
            firebaseService.createUser({ ...data, setLoading });
            message.success('User created succesfully!');
            userForm.resetFields();
        } else {
            message.error('Passwords does not match');
        }
    };

    return (
        <>
            <PageTitle title='Create User' />
            <Form
                form={userForm}
                name='create-user'
                onFinish={onSubmit}
                autoComplete='off'
                layout='vertical'
            >
                <Row>
                    <Col xs={24}>
                        <Form.Item<FieldType>
                            label='Email'
                            name='email'
                            rules={[
                                { required: true, message: 'Required field' },
                                {
                                    type: 'email',
                                    message: 'Please enter a valid email!',
                                },
                            ]}
                        >
                            <Input allowClear />
                        </Form.Item>
                    </Col>
                    <Col xs={24}>
                        <Form.Item<FieldType>
                            label='Password'
                            name='password'
                            rules={[
                                { required: true, message: 'Required field' },
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>
                    </Col>
                    <Col xs={24}>
                        <Form.Item<FieldType>
                            label='Confirm Password'
                            name='confirmPassword'
                            rules={[
                                { required: true, message: 'Required field' },
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>
                    </Col>
                    <Col xs={24}>
                        <Form.Item<FieldType>
                            label='Role'
                            name='role'
                            rules={[
                                { required: true, message: 'Required field' },
                            ]}
                            initialValue={roles[0].toLowerCase()}
                        >
                            <Select
                                onChange={onRoleChange}
                                options={roles.map((role) => ({
                                    value: role.toLowerCase(),
                                    label: role,
                                }))}
                            />
                        </Form.Item>
                    </Col>
                    {mainRole === 'vikin' && (
                        <Col xs={24}>
                            <Form.Item<FieldType>
                                label='Sub Role'
                                name='subRole'
                                rules={[
                                    {
                                        required: true,
                                        message: 'Required field',
                                    },
                                ]}
                                initialValue={subRoles[0].toLowerCase()}
                            >
                                <Select
                                    options={subRoles.map((role) => ({
                                        value: role.toLowerCase(),
                                        label: role,
                                    }))}
                                />
                            </Form.Item>
                        </Col>
                    )}
                    <Col xs={24}>
                        <Form.Item>
                            <Button
                                type='primary'
                                htmlType='submit'
                                className='float-end'
                                loading={loading}
                                disabled={loading}
                            >
                                Submit
                            </Button>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </>
    );
};

export default CreateUser;
