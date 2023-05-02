import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import "./login.scss";
import { Button, Input, Form, Menu, message } from "antd";
import { MailOutlined, UserOutlined } from '@ant-design/icons';

const Login = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const loginError = (content) => {
    messageApi.open({
      type: 'error',
      content: content,
    });
  };
  const loginSuccess = () => {
    messageApi.success('登陆成功');
  };

  const [inputs, setInputs] = useState({
    username: "",
    password: "",
  });
  const [mode, setMode] = useState(true);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState(0);

  const navigate = useNavigate()

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const { login, changeOnline, sendLoginCode, loginEmail } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      mode ? await login(inputs) : await loginEmail(email, code);
      await changeOnline(inputs);
      loginSuccess();
      navigate("/");
    } catch (err) {
      loginError(err.response.data);
    }
  };

  return (
    <>
      {contextHolder}
      <div className="login">
        <div className="card">
          <div className="right">
            <Menu mode="horizontal" defaultSelectedKeys={["account"]} items={[
              {
                label: '账号登陆',
                key: 'account',
                icon: <UserOutlined />,
                onClick: () => {
                  setMode(true);
                }
              },
              {
                label: '邮箱登陆',
                key: 'mail',
                icon: <MailOutlined />,
                onClick: () => {
                  setMode(false);
                }
              }]} />
            {mode ?
              <Form>
                <form>
                  <Form.Item label="账号" required>
                    <Input
                      type="text"
                      placeholder="Username"
                      name="username"
                      onChange={handleChange}
                    />
                  </Form.Item>
                  <Form.Item label="密码" required>
                    <Input.Password
                      type="password"
                      placeholder="Password"
                      name="password"
                      onChange={handleChange}
                    />
                  </Form.Item>
                  <Button type="primary" onClick={handleLogin}>登陆</Button>
                </form>
              </Form>
              : <Form>
                <form>
                  <Form.Item label="邮箱" required>
                    <Input
                      type="text"
                      placeholder="请输入邮箱"
                      name="username"
                      onChange={(e) => { setEmail(e.target.value); }}
                    />
                  </Form.Item>
                  <Button onClick={() => { sendLoginCode(email); }} icon={<MailOutlined />} >发送验证码</Button>
                  <Form.Item label="验证码" required>
                    <Input
                      type="text"
                      placeholder="请输入收到的验证码"
                      name="password"
                      onChange={(e) => { setCode(Number(e.target.value)); }}
                    />
                  </Form.Item>
                  <Button type="primary" onClick={handleLogin}>登陆</Button>
                </form>
              </Form>}
          </div>
          <div className="left">
            <h1>Hello World.</h1>
            <p>
              幸运聊网络社交平台--精简社交，丰富功能。
            </p>
            <span>还没有账号？</span>
            <Link to="/register">
              <button>立即注册</button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
