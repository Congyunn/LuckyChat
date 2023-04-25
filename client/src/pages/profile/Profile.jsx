import "./profile.scss";
import PlaceIcon from "@mui/icons-material/Place";
import LanguageIcon from "@mui/icons-material/Language";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Posts from "../../components/posts/Posts";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { useLocation, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import Update from "../../components/update/Update";
import { useState } from "react";
import { Col, Row, Tooltip } from "antd";
import { ContactsOutlined, AuditOutlined, ManOutlined, WomanOutlined } from "@ant-design/icons";
import { useEffect } from "react";

const Profile = () => {
  const navigate = useNavigate();

  const [openUpdate, setOpenUpdate] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const userId = Number(useLocation().pathname.split("/")[2]);

  const { isLoading, error, data } = useQuery(["user"], () =>
    makeRequest.get("/users/find/" + userId).then((res) => {
      return res.data;
    })
  );

  const { isLoading: rIsLoading, data: relationshipData } = useQuery(
    ["relationship"],
    () =>
      makeRequest.get("/relationships?followedUserId=" + userId).then((res) => {
        return res.data;
      })
  );

  const queryClient = useQueryClient();

  const mutation = useMutation(
    (following) => {
      if (following)
        return makeRequest.delete("/relationships?userId=" + userId);
      return makeRequest.post("/relationships", { userId });
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["relationship"]);
      },
    }
  );

  const handleFollow = () => {
    mutation.mutate(relationshipData.includes(currentUser.id));
  };

  return (
    <div className="profile">
      {isLoading ? (
        "loading"
      ) : (
        <>
          <div className="images">
            <img src={data.coverPic} alt="" className="cover" />
            <img src={data.profilePic} alt="" className="profilePic" />
          </div>
          <div className="profileContainer">
            <Row>
              <div className="uInfo">
                <Col span={8}>
                  <div className="left">
                    <div className="info">
                      <Tooltip title="生日">
                        <div className="item">
                          <ContactsOutlined style={{ width: '20px', height: '20px' }} />
                          <span>：{data?.brithday || "       "}</span>
                        </div>
                      </Tooltip>
                      <Tooltip title="年龄">
                        <div className="item">
                          <ContactsOutlined style={{ width: '20px', height: '20px' }} />
                          <span>：{data?.age || "      "}岁</span>
                        </div>
                      </Tooltip>
                    </div>
                  </div>
                </Col>
                <Col span={8}>
                  <div className="center">
                    <br />
                    <span>{data.name}</span>
                    <div className="info">
                      <Tooltip title="个人简介">
                        <div className="item">
                          <AuditOutlined style={{ width: '20px', height: '20px' }} />
                          <span style={{ fontSize: '15px' }}>：{data?.desc || "      "}</span>
                        </div>
                      </Tooltip>
                    </div>
                    <div className="info">
                      <Tooltip title="位置">
                        <div className="item" onClick={() => {
                          if (data?.city) {
                            window.open(`https://gaode.com/search?query=${data.city}`)
                          }
                        }}>
                          <PlaceIcon />
                          <span>{data?.city || "      "}</span>
                        </div>
                      </Tooltip>
                      <Tooltip title="网站">
                        <div className="item" onClick={() => {
                          if (data?.website) {
                            const url =
                              (data.website.splite('.')[0] === 'http://' ||
                                data.website.splite('.')[0] === 'https://') ?
                                data.website :
                                `ws://${data.website}`
                            window.open(url);
                          }
                        }}>
                          <LanguageIcon />
                          <span>{data?.website || "      "}</span>
                        </div>
                      </Tooltip>
                    </div>
                    {rIsLoading ? (
                      "loading"
                    ) : userId === currentUser.id ? (
                      <button onClick={() => setOpenUpdate(true)}>update</button>
                    ) : (
                      <button onClick={handleFollow}>
                        {relationshipData.includes(currentUser.id)
                          ? "Following"
                          : "Follow"}
                      </button>
                    )}
                  </div>
                </Col>
                <Col span={8}>
                  <div className="right">
                    <div className="info">
                      <Tooltip title="电子邮件">
                        <div className="item">
                          <EmailOutlinedIcon style={{ width: '20px', height: '20px' }} />
                          <span>：{data?.email || "      "}</span>
                        </div>
                      </Tooltip>
                      {data?.gender ?
                        <Tooltip title="性别">
                          <div className="item">
                            {Number(data.gender) === 0 ? <WomanOutlined /> : <ManOutlined />}
                            <span>：{Number(data.gender) === 0 ? '女' : '男'}</span>
                          </div>
                        </Tooltip> :
                        <Tooltip title="性别">
                          <div className="item">
                            <span><WomanOutlined /> / <ManOutlined /></span>
                          </div>
                        </Tooltip>
                      }
                    </div>
                  </div>
                </Col>
              </div>
              <Posts userId={userId} />
            </Row>
          </div>
        </>
      )
      }
      <Update openUpdate={openUpdate} setOpenUpdate={setOpenUpdate} user={data} />
    </div >
  );
};

export default Profile;
