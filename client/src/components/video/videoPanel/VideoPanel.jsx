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
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then((stream) => {
                const localVideo = localVideoRef.current;
                if (localVideo) {
                    localVideo.srcObject = stream;
                }
                myPeer.on('call', call => {
                    call.answer(stream);
                    call.on('stream', userVideoStream => {
                        addVideoStream(remoteVideoRef.current, userVideoStream);
                    });
                });
                window.videoSocket.on('user-connected', userId => {
                    connectToNewUser(userId, stream);
                });
            })
            .catch((e) => {
                window.socket.emit('sendHangupVideo', {
                    hangupFromId: currentUser?.id,
                    hangupToId: currentVideoId
                })
                console.log('打开摄像头失败', e);
            });
        myPeer.on('open', id => {
            window.videoSocket.emit('join-room', currentVideoId, id);
        });
        return () => {
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
