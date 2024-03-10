import React from 'react';
import { PageTitle } from '..';
import UsersTable from '../common/UsersTable';

const RegisteredUsers = () => {
    return (
        <>
            <PageTitle title='vikin - Registered users' />
            <UsersTable getByRide={false} showFilters={true} />
        </>
    );
};

export default RegisteredUsers;
