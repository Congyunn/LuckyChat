import { useRef, useEffect } from "react";
import { AuthContext } from "../../../context/authContext";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { makeRequest } from "../../../axios";
import { Button } from "antd";
import { PhoneOutlined } from "@ant-design/icons";
import { useContext } from "react";
import { Peer } from "peerjs";

const VideoPanel = ({ acceptVideo, setAcceptVideo, currentVideoId, peerFlag }) => {

    const { currentUser } = useContext(AuthContext);

    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);

    const myPeer = new Peer();

    function connectToNewUser (userId, stream) {
        const call = myPeer.call(userId, stream);
        call.on('stream', userVideoStream => {
            addVideoStream(remoteVideoRef.current, userVideoStream)
        });
        call.on('close', () => {
            setAcceptVideo(false);
        });
    }


    function addVideoStream (video, stream) {
        video.srcObject = stream;
        video.addEventListener('loadedmetadata', () => {
            video.play();
        });
    }

    useEffect(() => {
        //通过浏览器内置函数获取视频和音频资源
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then((stream) => {
                const localVideo = localVideoRef.current;
                if (localVideo) {
                    //将本地媒体资源赋到小框中
                    localVideo.srcObject = stream;
                }
                //将本地资源上传到PeerJS的云服务中
                myPeer.on('call', call => {
                    call.answer(stream);
                    call.on('stream', userVideoStream => {
                        addVideoStream(remoteVideoRef.current, userVideoStream);
                    });
                });
                window.videoSocket.on('user-connected', userId => {
                    //防止对方用户加入peerjs之前就链接从而产生报错，设置链接对方用户的延迟
                    setTimeout(() => {
                        connectToNewUser(userId, stream);
                    }, 1000);
                });
            })
            .catch((e) => {
                //打开摄像头失败，兜底操作
                window.socket.emit('sendHangupVideo', {
                    hangupFromId: currentUser?.id,
                    hangupToId: currentVideoId
                })
                console.log('打开摄像头失败', e);
            });
        //打开PeerJS服务，将当前用户加入到视频房间中
        myPeer.on('open', id => {
            window.videoSocket.emit('join-room', currentVideoId, id);
        });
        return () => {
            //退出界面或挂断时关闭链接
            myPeer.disconnect();
        }
    }, []);

    const offVideoInvitation = () => {
        window.socket.emit('sendHangupVideo', {
            hangupFromId: currentUser?.id,
            hangupToId: currentVideoId
        });
        setAcceptVideo(false);
    }

    return acceptVideo ? (
        <div className="video-chat-container">
            <div className="video-container">
                <video autoPlay
                    className="remote-video"
                    id="remote-video"
                    ref={remoteVideoRef} />
                <video autoPlay muted
                    className="local-video"
                    id="local-video"
                    ref={localVideoRef} />
            </div>
            <Button
                shape="circle" danger
                type="primary" className="turn-off-video"
                size="large" icon={<PhoneOutlined />}
                onClick={offVideoInvitation}
            />
        </div>
    ) : (<></>);
};

export default VideoPanel;
