import { PageTitle, UsersTable } from '..';

const RegisteredUsers = () => {
    return (
        <>
            <PageTitle title='vikin - Registered users' />
            <UsersTable getByRide={false} />
        </>
    );
};

export default RegisteredUsers;
