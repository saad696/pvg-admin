import { signInWithEmailAndPassword } from "firebase/auth";
import { Row, Col, Form, Input, Button, Card, message } from "antd";
import { auth, db } from "../services/firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { helperService } from "../utils/helper";
import { LoadingContext } from "../context/LoadingContext";
import { PageTitle } from "..";

type FieldType = {
  email: string;
  password: string;
};

const Login = () => {
  const { user, setUser } = useContext(UserContext);
  const { loading, setLoading } = useContext(LoadingContext);
  const navigate = useNavigate();

  const onSubmit = (formData: LoginFormData): void => {
    setLoading(true);
    const { email, password } = formData;

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const _user = userCredential.user;
        const userRoleDocRef = doc(db, "user-roles", _user.uid);
        return getDoc(userRoleDocRef);
      })
      .then((userRoleDetails) => {
        if (userRoleDetails.exists()) {
          setUser({
            user: user.user,
            role: userRoleDetails.data().main,
            subRole: userRoleDetails.data().subRole,
            isLoggedIn: true,
          });
          sessionStorage.clear();
          navigate("/");
        } else {
          message.error("No role defined for this user");
          helperService.logout();
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
        message.error(error.message);
      });
  };

  useEffect(() => {
    console.log(user);
    
    if (user.isLoggedIn) {
      console.log('here');
      
      navigate("/");
    }
  }, [user]);

  return (
    <div className="container">
      <PageTitle title="Admin Login" />
      <Card className="shadow-lg">
        <Form
          name="login"
          onFinish={onSubmit}
          autoComplete="off"
          layout="vertical"
        >
          <Row>
            <Col xs={24}>
              <Form.Item<FieldType>
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Please input your email!" },
                  { type: "email", message: "Please enter a valid email!" },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item<FieldType>
                label="Password"
                name="password"
                rules={[
                  { required: true, message: "Please input your password!" },
                ]}
              >
                <Input.Password />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="float-end"
                  loading={loading}
                  disabled={loading}
                >
                  Submit
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
