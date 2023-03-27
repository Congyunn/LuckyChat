import { useContext, useEffect } from "react";
import { AuthContext } from "../../../context/authContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../../axios";
import { Spin, Input, Col, Row } from "antd";
import ChatMsgPop from "../chatMsgPop/ChatMsgPop";

const ChatPanel = ({ currentChat }) => {
    const { currentUser } = useContext(AuthContext);

    const { isLoading, error, data } = useQuery([`messageList${currentChat?.id}`], () =>
        makeRequest.get(`/chat/msg?fromId=${currentUser?.id}&toId=${currentChat?.id}`).then((res) => {
            return res.data;
        }).catch((e) => {
            console.log('获取私聊消息失败', error);
        })
    );
    const queryClient = useQueryClient();
    window.socket.on('receiveMsg', (...msgData) => {
        console.log('newMsgComming!')
        queryClient.refetchQueries([`messageList${currentChat?.id}`]);
    })

    // const mutation = useMutation(
    //     (newSendMessage) => {
    //         return makeRequest.post("/chat/msg", newSendMessage);
    //     },
    //     {
    //         onSuccess: () => {
    //             // Invalidate and refetch

    //         },
    //     }
    // );

    return (
        <>
            <Spin spinning={isLoading} />
            {data?.map((item, index) => (
                <ChatMsgPop
                    chatMsg={item}
                    key={item?.id || index}
                    currentUserAvatar={currentUser?.profilePic}
                    currentChatAvatar={currentChat?.profilePic} />
            ))}
        </>
    );
};

export default ChatPanel;
