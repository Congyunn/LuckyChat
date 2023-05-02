import "./rightBar.scss";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useContext, useState, useEffect } from "react";
import { makeRequest } from "../../axios";
import { AuthContext } from "../../context/authContext"
import {
  Empty, Tooltip, Button,
  Col, Row, Modal,
  Avatar, List, Image,
  message
} from "antd";
import { UserAddOutlined, TeamOutlined } from '@ant-design/icons';

const RightBar = () => {

  const [messageApi, contextHolder] = message.useMessage();

  const { currentUser } = useContext(AuthContext);

  const navigate = useNavigate();

  const [commonFriends, setCommonFriends] = useState([]);
  const [commonFriendsList, setCommonFriendsList] = useState([]);
  const [commonFriendsVisible, setCommonFriendsVisible] = useState(false);

  const [interestFriends, setInterestFriends] = useState([]);
  const [interestFriendsList, setInterestFriendsList] = useState([]);
  const [interestFriendsVisible, setInterestFriendsVisible] = useState(false);

  const { data: onlineData } = useQuery(["chatOnlineFriends"], () =>
    makeRequest.get(`/chat/${currentUser.id}?type=online`).then((res) => {
      return res.data;
    }).catch((e) => {
      messageApi.error('获取在线好友失败！');
      console.log('获取在线好友失败！', e);
    })
  );

  const getCommonFriends = async () => {
    await makeRequest.get(`/recommend/common?id=${currentUser?.id}`).then((res) => {
      setCommonFriends(res.data);
    }).catch((e) => {
      messageApi.error('获取共同好友失败！');
      console.log('获取共同好友失败！', e)
    })
  }
  const getCommonFriendsList = async () => {
    await makeRequest.get(`/recommend/common?id=${currentUser?.id}&list=true`).then((res) => {
      setCommonFriendsList(res.data);
    }).catch((e) => {
      messageApi.error('获取共同好友失败！');
      console.log('获取共同好友失败！', e)
    })
  }

  const getInterestFriends = async () => {
    await makeRequest.get(`/recommend/interest?id=${currentUser?.id}`).then((res) => {
      setInterestFriends(res.data);
    }).catch((e) => {
      messageApi.error('获取兴趣好友失败！');
      console.log('获取兴趣好友失败！', e)
    })
  }
  const getInterestFriendsList = async () => {
    await makeRequest.get(`/recommend/interest?id=${currentUser?.id}&list=true`).then((res) => {
      setInterestFriendsList(res.data);
    }).catch((e) => {
      messageApi.error('获取兴趣好友失败！');
      console.log('获取兴趣好友失败！', e)
    })
  }

  useEffect(() => {
    getCommonFriends();
    getInterestFriends();
  }, []);
  useEffect(() => {
    if (commonFriendsVisible) {
      getCommonFriendsList();
    }
  }, [commonFriendsVisible]);
  useEffect(() => {
    if (interestFriendsVisible) {
      getInterestFriendsList();
    }
  }, [interestFriendsVisible]);

  const page = useLocation().pathname.split("/")[1];
  return ["chat", "voice", "video", "watch", "schedule", "profile"].includes(page) ? <></> : (
    <div className="rightBar">
      {contextHolder}
      <Modal title="更多共同好友"
        open={commonFriendsVisible}
        onCancel={() => setCommonFriendsVisible(false)} >
        {commonFriendsList.length ?
          <List
            itemLayout="horizontal"
            dataSource={commonFriendsList}
            renderItem={(friend, index) => (
              <List.Item key={index}>
                <List.Item.Meta
                  avatar={<Avatar src={friend?.profilePic} />}
                  title={
                    <Row>
                      <Col span={16}>
                        <a onClick={() => navigate(`/profile/${friend?.id}`)}>{friend?.name}</a>
                      </Col>
                      <Col span={8}>
                        <span>有 {friend?.count} 位好友关注了ta</span>
                      </Col>
                    </Row>
                  }
                  description={`性别：${(friend?.gender) === 0 ? '女' : (friend?.gender) === 1 ? '男' : '秘密'}，
                  年龄：${friend?.age || '秘密'}，
                  个人简介：${friend?.desc || '无'}`
                  }
                />
              </List.Item>
            )}
          />
          :
          <Empty description="没有共同好友可以推荐" />}
      </Modal>
      <div className="container">
        <div className="item">
          <Row>
            <Col span={16}>
              <Tooltip title="您关注的其他关注" >
                <span style={{ fontSize: '16px' }}>你可能认识的人</span>
              </Tooltip>
            </Col>
            <Col span={4}>
              <Tooltip title="更多可能认识的人">
                <Button icon={<TeamOutlined />} onClick={() => setCommonFriendsVisible(true)} shape="circle" />
              </Tooltip>
            </Col>
            <Col span={4}>
              <Tooltip title="换一批">
                <Button icon={<UserAddOutlined />} onClick={getCommonFriends} shape="circle" />
              </Tooltip>
            </Col>
          </Row>
          {commonFriends.length ?
            commonFriends.map((friend, index) => (
              <div className="user" key={index}>
                <div className="userInfo">
                  <Image
                    src={friend?.profilePic}
                    alt=""
                  />
                  <span onClick={() => navigate(`/profile/${friend?.id}`)}>{friend?.name}</span>
                </div>
                <div className="buttons">
                  <button onClick={() => {
                    makeRequest.post(`/relationships`, { userId: friend?.id }).then((res) => {
                      getCommonFriends();
                    }).catch((e) => {
                      messageApi.error('关注好友失败，请稍后再试');
                    })
                  }}>关注</button>
                </div>
              </div>
            )) :
            <Empty description="没有共同好友可以推荐" />}
        </div>
        <Modal title="更多相似兴趣好友"
          open={interestFriendsVisible}
          onCancel={() => setInterestFriendsVisible(false)} >
          {interestFriendsList.length ?
            <List
              itemLayout="horizontal"
              dataSource={interestFriendsList}
              renderItem={(friend, index) => (
                <List.Item key={index}>
                  <List.Item.Meta
                    avatar={<Avatar src={friend?.profilePic} />}
                    title={
                      <Row>
                        <Col span={16}>
                          <a onClick={() => navigate(`/profile/${friend?.id}`)}>{friend?.name}</a>
                        </Col>
                        <Col span={8}>
                          <span>有 {friend?.count} 位好友关注了ta</span>
                        </Col>
                      </Row>
                    }
                    description={`性别：${(friend?.gender) === 0 ? '女' : (friend?.gender) === 1 ? '男' : '秘密'}，
                  年龄：${friend?.age || '秘密'}，
                  个人简介：${friend?.desc || '无'}`
                    }
                  />
                </List.Item>
              )}
            />
            :
            <Empty description="没有共同好友可以推荐" />}
        </Modal>
        <div className="item">
          <Row>
            <Col span={16}>
              <Tooltip title="兴趣领域相似的推荐" >
                <span style={{ fontSize: '16px' }}>相似兴趣推荐</span>
              </Tooltip>
            </Col>
            <Col span={4}>
              <Tooltip title="更多兴趣推荐好友">
                <Button icon={<TeamOutlined />} onClick={() => setInterestFriendsVisible(true)} shape="circle" />
              </Tooltip>
            </Col>
            <Col span={4}>
              <Tooltip title="换一批">
                <Button icon={<UserAddOutlined />} onClick={getInterestFriends} shape="circle" />
              </Tooltip>
            </Col>
          </Row>
          {interestFriends.length ?
            interestFriends.map((friend, index) => (
              <div className="user" key={index}>
                <div className="userInfo">
                  <Image
                    src={friend?.profilePic}
                    alt=""
                  />
                  <span onClick={() => navigate(`/profile/${friend?.id}`)}>{friend?.name}</span>
                </div>
                <div className="buttons">
                  <button onClick={() => {
                    makeRequest.post(`/relationships`, { userId: friend?.id }).then((res) => {
                      getCommonFriends();
                    }).catch((e) => {
                      messageApi.error('关注好友失败，请稍后再试');
                    })
                  }}>关注</button>
                </div>
              </div>
            )) :
            <Empty description="没有相似兴趣好友可以推荐" />}
        </div>
        <div className="item">
          <span>在线好友</span>
          {onlineData?.length ?
            onlineData?.map((friend, index) => (
              <div className="user" key={friend?.id || index}>
                <div className="userInfo">
                  <img
                    src={friend?.profilePic}
                    alt=""
                  />
                  <div className="online" />
                  <span>{friend?.name}</span>
                </div>
              </div>
            )) : <Empty description="暂无好友在线" />}
        </div>
      </div>
    </div>
  );
};

export default RightBar;
