import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { message, Row, Col, Button, Input, Form } from "antd";
import "./register.scss";
import axios from "axios";

const Register = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const registerError = (content) => {
    messageApi.open({
      type: 'error',
      content: content,
    });
  };
  const registerSuccess = () => {
    messageApi.open({
      type: 'success',
      content: '注册成功，请登陆',
    });
  };
  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    emailCode: "",
    password: "",
    name: "",
  });

  const navigate = useNavigate();
  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSend = async (e) => {
    try {
      await axios.get(`http://localhost:8800/api/auth/register/email?email=${inputs.email}&username=${inputs.username}`);
    } catch (err) {
      registerError(err.response.data);
    }
  };

  const handleClick = async (e) => {
    try {
      await axios.post("http://localhost:8800/api/auth/register", inputs);
      registerSuccess();
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (err) {
      registerError(err.response.data);
    }
  };

  return (
    <>
      {contextHolder}
      <div className="register">
        <div className="card">
          <div className="right">
            <h1>注册账号</h1>
            <Form
              onFinish={handleClick}>
              <input
                required
                type="text"
                placeholder="Username"
                name="username"
                onChange={handleChange}
              />
              <Input
                required
                type="email"
                placeholder="Email"
                name="email"
                onChange={handleChange}
              />
              <Row>
                <Col span={18}>
                  <Input
                    required
                    type="text"
                    placeholder="邮箱验证码"
                    name="emailCode"
                    onChange={handleChange}
                  />
                </Col>
                <Col span={6}>
                  <Button onClick={handleSend} style={{ width: '100%', height: '100%' }} >发送</Button>
                </Col>
              </Row>
              <Input.Password
                required
                type="password"
                placeholder="Password"
                name="password"
                onChange={handleChange}
              />
              <Input
                required
                type="text"
                placeholder="Name"
                name="name"
                onChange={handleChange}
              />
              <Form.Item>
                <Button type="primary" htmlType="submit" size="large" style={{ width: '100%' }}>
                  注册
                </Button>
              </Form.Item>
            </Form>
          </div>
          <div className="left">
            <h1>Lucky</h1>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero cum,
              alias totam numquam ipsa exercitationem dignissimos, error nam,
              consequatur.
            </p>
            <span>Do you have an account?</span>
            <Link to="/login">
              <button>Login</button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
