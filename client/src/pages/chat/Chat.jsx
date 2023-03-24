import "./Chat.scss";
import { Layout, Menu, theme, Image, Row, Col } from 'antd';
import React, { useContext, useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { AuthContext } from '../../context/authContext'
import { UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Header, Content, Footer, Sider } = Layout;
const Chat = () => {
    const {
        token: { colorBgContainer },
    } = theme.useToken();
    const { currentUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const [currentChat, setCurrentChat] = useState(null);

    const { isLoading, error, data } = useQuery(["chatFriends"], () =>
        makeRequest.get("/chat/" + currentUser.id).then((res) => {
            return res.data;
        })
    );

    return (
        <Layout style={{ height: '91vh' }}>
            <Sider
                breakpoint="lg"
                collapsedWidth="0"
                onBreakpoint={(broken) => {
                    console.log(broken);
                }}
                onCollapse={(collapsed, type) => {
                    console.log(collapsed, type);
                }}
            >
                <div className="logo" />
                <Menu
                    theme="dark"
                    mode="inline"
                    // defaultSelectedKeys={['4']}
                    items={data?.map(
                        item => ({
                            key: item?.id,
                            icon: React.createElement(UserOutlined),
                            label: item?.username,
                        }),
                    )}
                    onClick={(e) => {
                        setCurrentChat(...data?.filter(userInfo => {
                            return userInfo.id == e.key
                        }));
                        navigate(`/chat/${currentUser.id}/chatto/${e.key}`)
                    }}
                />
            </Sider>
            <Layout>
                <Header
                    style={{
                        padding: 0,
                        background: colorBgContainer,
                    }}
                >
                    <Row>
                        <Col span={8}>
                            <Image src={currentChat?.profilePic} style={{
                                'width': '60px',
                                'height': '60px',
                                'border-radius': '50%',
                                'object-fit': 'cover'
                            }} />
                        </Col>
                        <span style={{ 'fontSize': '30px', 'fontWeight': 800 }}>
                            {currentChat?.username}
                        </span>
                        {currentChat?.desc && <span>个性签名：{currentChat?.desc}</span>}
                    </Row>
                </Header>
                <Content
                    style={{
                        margin: '24px 16px 0',
                    }}
                >
                    <div
                        style={{
                            padding: 24,
                            minHeight: 360,
                            background: colorBgContainer,
                        }}
                    >
                        content
                    </div>
                </Content>
                <Footer
                    style={{
                        textAlign: 'center',
                    }}
                >
                    Ant Design ©2023 Created by Ant UED
                </Footer>
            </Layout>
        </Layout>
    );
};
export default Chat;