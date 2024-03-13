import React, { useContext } from 'react';

import { Button, Tooltip } from 'antd';
import { DeliveredProcedureOutlined } from '@ant-design/icons';
import { LoadingContext } from '../context/LoadingContext';
import { useLocation } from 'react-router-dom';
import { firebaseService } from '../services/firebase/firebaseService';

interface MarkAsReadProps {
    data: IContact;
}

const MarkAsReadAction: React.FC<MarkAsReadProps> = ({ data }) => {
    const location = useLocation();
    const id = location.pathname.split('/')[1];
    const { setLoading } = useContext(LoadingContext);

    const onAction = async () => {
        setLoading(true);
        await firebaseService.markMessageASRead(id, data, setLoading);
    };

    return (
        <Tooltip title={'Mark as read'}>
            <Button
                type='text'
                icon={<DeliveredProcedureOutlined />}
                onClick={onAction}
            />
        </Tooltip>
    );
};

export default MarkAsReadAction;
