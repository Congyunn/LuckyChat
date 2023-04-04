import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthContextProvider } from "./context/authContext";
import { DarkModeContextProvider } from "./context/darkModeContext";
import { io } from "socket.io-client";
import { ConfigProvider } from "antd";
import zhCN from 'antd/es/locale/zh_CN';
import 'dayjs/locale/zh-cn';

//单例模式全局变量
window.socket = io("ws://localhost:8801"); //每个客户端只建立一个Socket连接
window.videoSocket = io("ws://localhost:8802"); //视频聊天socket连接
window.connectCount = 1; //只有登陆到home界面才与socket服务器建立连接
window.singleAccept = true; //接受视频请求只弹出一个对话框

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <DarkModeContextProvider>
    <AuthContextProvider>
      <ConfigProvider locale={zhCN}>
        <App />
      </ConfigProvider>
    </AuthContextProvider>
  </DarkModeContextProvider>
);
