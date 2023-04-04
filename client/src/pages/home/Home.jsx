import Stories from "../../components/stories/Stories"
import Posts from "../../components/posts/Posts"
import Share from "../../components/share/Share"
import "./home.scss"
import { useContext, useEffect } from "react"
import { AuthContext } from "../../context/authContext"
import { makeRequest } from "../../axios"
import { notification, Modal } from "antd"
import axios from "axios"
import { useNavigate, useParams } from "react-router-dom"

const { confirm } = Modal;

const Home = () => {
  const { currentUser, setOfflineIdArray } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const online = async () => {
      await axios.put("http://localhost:8800/api/auth/login", { username: currentUser.username });
    }
    online();
  }, []);

  //刚上线获取离线消息通知
  const getOfflineMsg = async () => {
    await makeRequest.get(`/chat/offlineMsg`).then((res) => {
      if (res.data?.length) {
        const fromIdArray = [...new Set(
          res.data?.map(msg => (
            msg.fromId
          )))]
        setOfflineIdArray(fromIdArray);
        const openOfflineNotification = () => {
          const fromIdCount = fromIdArray?.length || 0;
          notification.info({
            message: '离线消息通知',
            description: `您不在时，有 ${fromIdCount} 位好友发来了 ${res.data?.length || 0} 条离线消息，请及时查看！`,
            onClick: () => {
              navigate(`/chat/${currentUser?.id}`);
            }
          });
        };
        openOfflineNotification();
      }
      return res.data;
    }).catch((e) => {
      console.log('获取离线消息失败！', e)
    })
  }

  //单例模式，只有登陆到home界面才与socket服务器建立连接
  if (window.connectCount === 1) {
    window.socket.emit('userIdToSocketId',
      { userId: currentUser?.id, socketId: window.socket.id });
    window.videoSocket.emit('userIdToVideoSocketId',
      { userId: currentUser?.id });
    getOfflineMsg();
    window.connectCount++;
  }

  //在线消息通知
  const openOnlineNotification = (msgData) => {
    notification.info({
      message: `好友 ${msgData?.fromName} 给您发消息啦！`,
      description: msgData?.msg ? `消息内容：${msgData?.msg}` : `语音消息，请前往聊天界面查看`,
      onClick: () => {
        navigate(`/chat/${currentUser?.id}`);
      }
    });
  };
  const msgFromId = useParams()?.chatToId || undefined;
  window.socket.on('receiveMsg', (msgData) => {
    //如果正在和这个人聊天就不用通知了
    Number(msgFromId) !== Number(msgData?.fromId) &&
      openOnlineNotification(msgData);
  })

  //收到视频邀请通知
  const showVideoConfirm = (data) => {
    window.singleAccept = false;
    confirm({
      title: '收到视频通话邀请',
      content: `${data?.fromName} 邀请您进行视频通话`,
      onOk () {
        window.socket.emit('acceptVideo', { ...data, accept: true });
        console.log('接受邀请');
        navigate(`/video/${currentUser?.id}/videoto/${data?.fromId}?accept=true`);
        window.singleAccept = true;
      },
      onCancel () {
        window.socket.emit('acceptVideo', { ...data, accept: false });
        console.log('拒绝邀请');
        window.singleAccept = true;
      },
      okText: '接受',
      cancelText: '拒绝'
    });
  };

  window.socket.on('receiveVideo', (data) => {
    window.singleAccept && showVideoConfirm(data);
  })

  return (
    <>
      <div className="home">
        <Stories />
        <Share />
        <Posts />
      </div>
    </>
  )
}

export default Home