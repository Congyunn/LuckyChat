import "./Chat.scss";
import { Layout, Menu, theme, Image, Row, Col } from 'antd';
import ChatInput from "../../components/chat/chatInput/ChatInput";
import ChatPanel from "../../components/chat/chatPanel/ChatPanel";
import React, { useContext, useState, useRef, useEffect } from 'react';
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { AuthContext } from '../../context/authContext'
import { UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

const { Header, Content, Footer, Sider } = Layout;
const Chat = () => {
    const {
        token: { colorBgContainer },
    } = theme.useToken();
    const { currentUser, offlineIdArray } = useContext(AuthContext);

    const navigate = useNavigate();

    const [currentChat, setCurrentChat] = useState(null);
    const [chatPanelList, setChatPanelList] = useState([]);

    const chatListRef = useRef(null);

    useEffect(() => {
        chatListRef.current.scrollTop = chatListRef.current.scrollHeight;
    }, [chatPanelList]);
    useEffect(() => {
        const online = async () => {
            await axios.put("http://localhost:8800/api/auth/login", { username: currentUser.username });
          }
          online();
    }, []);

    const { data: onlineData } = useQuery(["chatOnlineFriends"], () =>
        makeRequest.get(`/chat/${currentUser.id}?type=online`).then((res) => {
            return res.data;
        }).catch((e) => {
            console.log('获取在线好友失败！', e)
        })
    );
    const { data: offlineData } = useQuery(["chatOfflineFriends"], () =>
        makeRequest.get(`/chat/${currentUser.id}?type=offline`).then((res) => {
            return res.data;
        }).catch((e) => {
            console.log('获取离线好友失败！', e)
        })
    );

    return (
        <Layout style={{ height: '91vh' }}>
            <Sider
                breakpoint="lg"
                collapsedWidth="0"
            >
                <div className="logo" />
                <Menu
                    theme="dark"
                    mode="inline"
                    items={[
                        {
                            key: 'online',
                            icon: React.createElement(UserOutlined),
                            label: '在线好友',
                            children:
                                onlineData?.map(
                                    item => ({
                                        key: item?.id,
                                        icon: <img src={item?.profilePic} className='menuImg' />,
                                        label: item?.name,
                                        danger: offlineIdArray.includes(item?.id)
                                    }),
                                )
                        }, {
                            key: 'offline',
                            icon: React.createElement(UserOutlined),
                            label: '离线好友',
                            children:
                                offlineData?.map(
                                    item => ({
                                        key: item?.id,
                                        icon: <img src={item?.profilePic} className='menuImg' />,
                                        label: item?.name,
                                        danger: offlineIdArray.includes(item?.id)
                                    }),
                                )
                        }]}
                    onClick={(e) => {
                        setCurrentChat(...(onlineData?.concat(offlineData))?.filter(userInfo => {
                            return Number(userInfo.id) === Number(e.key)
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
                        {currentChat ? (
                            <>
                                <Col span={8}>
                                    <Image src={currentChat?.profilePic} style={{
                                        'width': '60px',
                                        'height': '60px',
                                        'borderRadius': '50%',
                                        'objectFit': 'cover'
                                    }} />
                                </Col>
                                <span style={{ 'fontSize': '30px', 'fontWeight': 800 }}>
                                    {currentChat?.name}
                                </span>
                                {currentChat?.desc && <span>个性签名：{currentChat?.desc}</span>}
                            </>) : (
                            <span style={{ 'fontSize': '30px', 'fontWeight': 800 }}>
                                开始聊天吧！
                            </span>
                        )
                        }
                    </Row>
                </Header>
                <Content
                    style={{
                        margin: '24px 16px 0',
                    }}
                >
                    <div
                        className="panelDiv"
                        ref={chatListRef}
                        style={{
                            padding: 15,
                            minHeight: 510,
                            background: colorBgContainer,
                            overflow: 'auto',
                            height: '100%'
                        }}
                    >
                        {currentChat &&
                            <ChatPanel currentChat={currentChat} setChatPanelList={setChatPanelList} />}
                    </div>
                </Content>
                <Footer
                    style={{
                        textAlign: 'center',
                        padding: 15
                    }}
                >
                    {currentChat &&
                        <ChatInput currentChat={currentChat} />}
                </Footer>
            </Layout>
        </Layout>
    );
};
export default Chat;