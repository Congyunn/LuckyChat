import { useContext, useState } from "react";
import { AuthContext } from "../../../context/authContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../../axios";
import { Button, Input, Col, Row } from "antd";

const { TextArea } = Input

const ChatInput = ({ currentChat }) => {
    const [sendLoading, setSendLoading] = useState(false);
    const [chatMsg, setChatMsg] = useState('');
    const { currentUser } = useContext(AuthContext);

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
        const newMessage = {
            fromId: currentUser?.id,
            fromName: currentUser?.name,
            toId: currentChat?.id,
            msg: chatMsg,
            isImage: false
        }
        window.socket.emit('sendMsg',
            { ...newMessage, socketId: window.socket?.id });
        mutation.mutate(newMessage);
        setSendLoading(false);
        setChatMsg("");
    };

    return (
        <Row>
            <Col>
                <TextArea
                    name="chatMsg"
                    placeholder="input chat text"
                    showCount
                    allowClear
                    autoSize
                    maxLength={100}
                    style={{ width: '380px' }}
                    value={chatMsg}
                    onChange={(e) => { setChatMsg(e.target.value) }}
                />
            </Col>
            <Col>
                <Button
                    type="primary"
                    onClick={handleSend}
                    loading={sendLoading} >发送</Button>
            </Col>
        </Row>
    );
};

export default ChatInput;
