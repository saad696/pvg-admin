import { EditOutlined, EyeOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const ViewAction: React.FC<{ navigateTo: string; isEdit?: boolean }> = ({
    navigateTo,
    isEdit = false,
}) => {
    const navigate = useNavigate();

    return (
        <Button
            type='text'
            onClick={() => {
                navigate(navigateTo);
            }}
        >
            {isEdit ? <EditOutlined /> : <EyeOutlined />}
        </Button>
    );
};

export default ViewAction;
