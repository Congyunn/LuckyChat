import { useContext, useEffect } from "react";
import { AuthContext } from "../../../context/authContext";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { makeRequest } from "../../../axios";
import { Spin } from "antd";
import ChatMsgPop from "../chatMsgPop/ChatMsgPop";

const ChatPanel = ({ currentChat, setChatPanelList }) => {
    const { currentUser } = useContext(AuthContext);

    const { isLoading, error, data } = useQuery([`messageList${currentChat?.id}`], () =>
        makeRequest.get(`/chat/msg?fromId=${currentUser?.id}&toId=${currentChat?.id}`).then((res) => {
            setChatPanelList(res.data)
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

    const mutation = useMutation(
        (updateId) => {
            return makeRequest.put("/chat/offlineMsg", updateId);
        }
    );

    useEffect(() => {
        if (currentChat?.id) {
            mutation.mutate({ fromId: currentChat?.id });
        }
    }, [currentChat?.id]);

    return (
        <div>
            <Spin spinning={isLoading} />
            {data?.map((item, index) => (
                <ChatMsgPop
                    chatMsg={item}
                    key={item?.id || index}
                    currentUserAvatar={currentUser?.profilePic}
                    currentChatAvatar={currentChat?.profilePic} />
            ))}
        </div>
    );
};

export default ChatPanel;
