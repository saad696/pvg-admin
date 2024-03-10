import { EyeOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";

const ViewAction: React.FC<{ navigateTo: string }> = ({ navigateTo }) => {
    const navigate = useNavigate();

    return (
        <Button
            type='text'
            onClick={() => {
                navigate(navigateTo);
            }}
        >
            <EyeOutlined />
        </Button>
    );
};

export default ViewAction