import './ChatMsgPop.scss';
import { useContext } from 'react';
import { AuthContext } from '../../../context/authContext'
import moment from 'moment';
import altImg from '../../../assets/1.png';

const ChatMsgPop = ({ chatMsg, currentUserAvatar, currentChatAvatar }) => {
    const { currentUser } = useContext(AuthContext);
    const { msg, createdAt, fromId } = chatMsg;
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
                <div className="content">{msg}</div>
                <div style={{ fontSize: '1vh' }}>{moment(createdAt).fromNow()}</div>
            </div>
        </div>
    );
};

export default ChatMsgPop;
