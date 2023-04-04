import "./navbar.scss";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { TeamOutlined, UserOutlined } from '@ant-design/icons';
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { Dropdown } from 'antd'
import { DarkModeContext } from "../../context/darkModeContext";
import { AuthContext } from "../../context/authContext";
import axios from "axios";

const Navbar = () => {
  const navigate = useNavigate()
  const { toggle, darkMode } = useContext(DarkModeContext);
  const { currentUser } = useContext(AuthContext);

  const jumpToChat = () => {
    navigate(`/chat/${currentUser.id}`);
  }

  const checkProfile = () => {
    navigate(`/profile/${currentUser.id}`);
  }

  const offline = async () => {
    await axios.put("http://localhost:8800/api/auth/logout", { username: currentUser.username });
    window.socket.close();
    window.videoSocket.close();
    window.connectCount--;
  }

  const logOut = async () => {
    await axios.post("http://localhost:8800/api/auth/logout");
    await offline();
    navigate(`/login`);
  }

  window.addEventListener('beforeunload', async (event) => {
    event.preventDefault();
    // Chrome requires returnValue to be set.
    event.returnValue = '';
    await offline();
  });

  return (
    <div className="navbar">
      <div className="left">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span>LuckyChat</span>
        </Link>
        <Dropdown menu={
          {
            items:
              [
                {
                  key: '1',
                  label: (
                    <a onClick={checkProfile}>
                      查看我的资料
                    </a>
                  )
                },
                {
                  key: '2',
                  label: (
                    <a onClick={logOut}>
                      退出登录
                    </a>
                  ),
                  danger: true
                }
              ]
          }
        }>
          <UserOutlined />
        </Dropdown>
        {darkMode ? (
          <WbSunnyOutlinedIcon onClick={toggle} />
        ) : (
          <DarkModeOutlinedIcon onClick={toggle} />
        )}
        <TeamOutlined onClick={jumpToChat} />
        <GridViewOutlinedIcon />
        <div className="search">
          <SearchOutlinedIcon />
          <input type="text" placeholder="Search..." />
        </div>
      </div>
      <div className="right">
        <PersonOutlinedIcon />
        <EmailOutlinedIcon />
        <NotificationsOutlinedIcon />
        <div className="user">
          <Dropdown menu={
            {
              items:
                [
                  {
                    key: '1',
                    label: (
                      <a onClick={checkProfile}>
                        查看我的资料
                      </a>
                    )
                  },
                  {
                    key: '2',
                    label: (
                      <a onClick={logOut}>
                        退出登录
                      </a>
                    ),
                    danger: true
                  }
                ]
            }
          }>
            <img
              src={currentUser.profilePic}
              alt=""
            // onClick={}
            />
          </Dropdown>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
