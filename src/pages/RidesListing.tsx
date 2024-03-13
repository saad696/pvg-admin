import { PageTitle, RidesTable } from '..';

const RidesListing = () => {
    return (
        <>
            <PageTitle title={`Vikin - Rides Listing`} />
            <RidesTable getByUser={false} />
        </>
    );
};

export default RidesListing;
