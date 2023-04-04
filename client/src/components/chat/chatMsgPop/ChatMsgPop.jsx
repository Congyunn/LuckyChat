import './ChatMsgPop.scss';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../../context/authContext'
import moment from 'moment';
import altImg from '../../../assets/1.png';
import { makeRequest } from '../../../axios';

const ChatMsgPop = ({ chatMsg, currentUserAvatar, currentChatAvatar }) => {
    const { currentUser } = useContext(AuthContext);
    const { msg, createdAt, fromId, isAudio, audio } = chatMsg;
    const [audioFile, setAudioFile] = useState(null);
    useEffect(() => {
        const getAudio = async () => {
            await makeRequest.get(`/chat/audio?filename=${audio}`, { responseType: 'blob' }).then((res) => {
                setAudioFile(new Blob([res.data], { type: 'audio/wav' }));
                return res.data;
            }).catch((e) => {
                console.log('获取语音消息失败', e);
            })
        }
        audio && getAudio();
    }, []);
    return (
        <div className={Number(fromId) === Number(currentUser.id) ? "bubble right" : "bubble left"}>
            <a className="avatar" href='true'>
                <img
                    src={Number(fromId) === Number(currentUser.id) ?
                        currentUserAvatar : currentChatAvatar}
                    alt={altImg}
                />
            </a>
            <div className="wrap">
                {isAudio === 'true' ? <audio src={audioFile && URL.createObjectURL(audioFile)} controls></audio> :
                    <div className="content">{msg}</div>
                }
                <div style={{ fontSize: '1vh' }}>{moment(createdAt).fromNow()}</div>
            </div>
        </div>
    );
};

export default ChatMsgPop;
