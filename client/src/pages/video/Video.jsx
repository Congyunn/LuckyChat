import "./Video.scss";
import { Layout, Menu, theme, Button, Modal, Col } from 'antd';
import React, { useContext, useState, useRef, useLayoutEffect, useEffect } from 'react';
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { AuthContext } from '../../context/authContext'
import { UserOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import VideoPanel from "../../components/video/videoPanel/VideoPanel"

const { Sider } = Layout;
const { confirm } = Modal;

const Chat = () => {
    const {
        token: { colorBgContainer },
    } = theme.useToken();
    const { currentUser } = useContext(AuthContext);

    const navigate = useNavigate();

    const [currentVideo, setCurrentVideo] = useState({ id: useParams()?.videoToId || null });
    const [acceptVideo, setAcceptVideo] = useState(false);
    const [acceptLoading, setAcceptLoading] = useState(false);

    const { data: onlineData } = useQuery(["chatOnlineFriends"], () =>
        makeRequest.get(`/chat/${currentUser.id}?type=online`).then((res) => {
            return res.data;
        }).catch((e) => {
            console.log('获取在线好友失败！', e)
        })
    );

    //从url中参数获知是否从其他页面接受邀请跳转过来的
    const search = window.location.search;
    const params = new URLSearchParams(search);
    const accept = params.get('accept');
    useEffect(() => {
        if (accept) {
            setAcceptVideo(true);
        }
    }, []);

    const sendVideoInvitation = () => {
        setAcceptLoading(true);
        window.socket.emit('sendVideo',
            {
                fromId: currentUser?.id,
                fromName: currentUser?.name,
                fromSocketId: window.socket?.id,
                toId: currentVideo?.id
            })
    }

    const showNotacceptConfirm = () => {
        window.singleAccept = false;
        confirm({
            title: '对方拒绝了你的邀请',
            cancelButtonProps: { style: { display: 'none' } },
            okText: '确定',
            onOk: () => { window.singleAccept = true; }
        });
    }

    const showHangupConfirm = () => {
        window.singleAccept = false;
        confirm({
            title: '对方挂断了语音通话',
            cancelButtonProps: { style: { display: 'none' } },
            okText: '确定',
            onOk: () => { window.singleAccept = true; }
        });
    }

    window.socket.on('fromAcceptVideo', (data) => {
        const { accept } = data;
        accept ? setAcceptVideo(true) :
            (window.singleAccept && showNotacceptConfirm());
        setAcceptLoading(false);
    })

    window.socket.on('acceptHangupVideo', (data) => {
        setAcceptVideo(false);
        window.singleAccept && showHangupConfirm();
    })

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
                                        label: item?.name
                                    }),
                                )
                        }]}
                    onClick={(e) => {
                        setCurrentVideo(...(onlineData?.filter(userInfo => {
                            return Number(userInfo.id) === Number(e.key)
                        })));
                        navigate(`/video/${currentUser.id}/videoto/${e.key}`)
                    }}
                />
            </Sider>
            <Layout>
                {currentVideo?.id && (
                    acceptVideo ?
                        <VideoPanel
                            acceptVideo={acceptVideo}
                            setAcceptVideo={setAcceptVideo}
                            currentVideoId={currentVideo?.id} /> :
                        <Button type="primary" size="large"
                            onClick={sendVideoInvitation} loading={acceptLoading}
                        >发起视频通话
                        </Button>
                )
                }
            </Layout>
        </Layout>
    );
};
export default Chat;