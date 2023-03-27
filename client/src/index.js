import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthContextProvider } from "./context/authContext";
import { DarkModeContextProvider } from "./context/darkModeContext";
import { io } from "socket.io-client";

window.socket = io("ws://localhost:8801"); //每个客户端只建立一个Socket连接
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <DarkModeContextProvider>
      <AuthContextProvider>
        <App />
      </AuthContextProvider>
    </DarkModeContextProvider>
);
