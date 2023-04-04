import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../../context/authContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../../axios";
import { Button, Input, Col, Row, Tooltip, message } from "antd";
import {
    AudioOutlined,
    MessageOutlined,
    PauseCircleOutlined,
    PlayCircleOutlined
} from '@ant-design/icons';
import Recorder from 'js-audio-recorder';

const { TextArea } = Input

const ChatInput = ({ currentChat }) => {
    const [sendLoading, setSendLoading] = useState(false);
    const [chatMsg, setChatMsg] = useState('');
    const [chatMod, setChatMod] = useState(true);
    const [audioMsg, setAudioMsg] = useState(null);

    const { currentUser } = useContext(AuthContext);

    const [messageApi, contextHolder] = message.useMessage();

    let recorder = chatMod ? null : new Recorder();

    const queryClient = useQueryClient();

    const mutation = useMutation(
        (newSendMessage) => {
            return makeRequest.post("/chat/msg", newSendMessage);
        },
        {
            onSuccess: () => {
                // Invalidate and refetch
                queryClient.refetchQueries(`messageList${currentChat?.id}`);
            },
        }
    );

    const handleSend = async (e) => {
        e.preventDefault();
        setSendLoading(true);
        let newMessage = new FormData();
        newMessage.append('fromId', currentUser?.id);
        newMessage.append('fromName', currentUser?.name);
        newMessage.append('toId', currentChat?.id);
        newMessage.append('msg', chatMsg);
        newMessage.append('isImage', false);
        newMessage.append('isAudio', chatMod ? false : true);
        newMessage.append('audio', chatMod ? null : audioMsg);
        const message = {
            fromId: currentUser?.id,
            toId: currentChat?.id
        }
        window.socket.emit('sendMsg',
            { ...message, socketId: window.socket?.id });
        mutation.mutate(newMessage);
        setSendLoading(false);
        setChatMsg("");
        setAudioMsg(null);
    };

    return (
        <>
            {contextHolder}
            <Row>
                {chatMod ? (
                    <>
                        <Col span={2}>
                            <Tooltip title="切换发送语音消息">
                                <Button
                                    type="primary" shape="circle"
                                    icon={<AudioOutlined />} onClick={() => { setChatMod(false); }}
                                />
                            </Tooltip>
                        </Col>
                        <Col span={18}>
                            <TextArea
                                name="chatMsg"
                                placeholder="input chat text"
                                showCount
                                allowClear
                                autoSize
                                maxLength={100}
                                value={chatMsg}
                                onChange={(e) => { setChatMsg(e.target.value) }}
                            />
                        </Col>
                        <Col span={4}>
                            <Button
                                type="primary"
                                onClick={handleSend}
                                loading={sendLoading} >发送</Button>
                        </Col>
                    </>) : (<>
                        <Col span={2}>
                            <Tooltip title="切换发送文字消息">
                                <Button
                                    type="primary" shape="circle"
                                    icon={<MessageOutlined />} onClick={() => { setChatMod(true); }}
                                />
                            </Tooltip>
                        </Col>
                        <Col span={6}>
                            <Button type="primary" shape="round" onClick={() => {
                                recorder?.start();
                                messageApi.open({
                                    type: 'success',
                                    content: '开始录音',
                                });
                            }}>
                                开始说话
                            </Button>
                        </Col>
                        <Col span={6}>
                            <Button type="primary" danger shape="round" onClick={() => {
                                setAudioMsg(recorder?.getWAVBlob() || null);
                                messageApi.open({
                                    type: 'success',
                                    content: '录音结束',
                                });
                            }}>
                                说话结束
                            </Button>
                        </Col>
                        <Col span={2}>
                            <Tooltip title="暂停">
                                <Button type="primary" danger
                                    shape="circle" icon={<PauseCircleOutlined />}
                                    onClick={() => {
                                        recorder?.pause();
                                        messageApi.open({
                                            type: 'success',
                                            content: '暂停录音',
                                        });
                                    }} />
                            </Tooltip>
                        </Col>
                        <Col span={2}>
                            <Tooltip title="继续">
                                <Button type="primary" shape="circle"
                                    icon={<PlayCircleOutlined />}
                                    onClick={() => {
                                        recorder?.resume();
                                        messageApi.open({
                                            type: 'success',
                                            content: '继续录音',
                                        });
                                    }} />
                            </Tooltip>
                        </Col>
                        <Col span={6}>
                            <Button
                                type="primary"
                                onClick={handleSend}
                                loading={sendLoading} >发送</Button>
                        </Col>
                    </>)
                }
            </Row>
            {!chatMod &&
                <>
                    <br />
                    <Row>
                        <Col span={24}>
                            <audio src={audioMsg && URL.createObjectURL(audioMsg)} controls
                                style={{
                                    border: '1px solid',
                                    borderRadius: '5%'
                                }}></audio>
                        </Col>
                    </Row>
                </>
            }
        </>
    );
};

export default ChatInput;
