import Stories from "../../components/stories/Stories"
import Posts from "../../components/posts/Posts"
import Share from "../../components/share/Share"
import "./home.scss"
import { useContext } from "react"
import { AuthContext } from "../../context/authContext"
import { makeRequest } from "../../axios"
import { notification } from "antd"
import { useNavigate } from "react-router-dom"

const Home = () => {
  const { currentUser, setOfflineIdArray } = useContext(AuthContext);
  const navigate = useNavigate();

  const getOfflineMsg = async () => {
    await makeRequest.get(`/chat/offlineMsg`).then((res) => {
      if (res.data?.length) {
        const fromIdArray = [...new Set(
          res.data?.map(msg => (
            msg.fromId
          )))]
        setOfflineIdArray(fromIdArray);
        const openNotification = () => {
          const fromIdCount = fromIdArray?.length || 0;
          notification.info({
            message: '离线消息通知',
            description: `您不在时，有 ${fromIdCount} 位好友发来了 ${res.data?.length || 0} 条离线消息，请及时查看！`,
            onClick: () => {
              navigate(`/chat/${currentUser?.id}`);
            }
          });
        };
        openNotification();
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
    getOfflineMsg();
    window.connectCount++;
  }

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