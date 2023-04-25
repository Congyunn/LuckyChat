import express from "express";
const app = express();
import * as io from "socket.io";
import { createServer } from 'http';
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import commentRoutes from "./routes/comments.js";
import likeRoutes from "./routes/likes.js";
import relationshipRoutes from "./routes/relationships.js";
import stories from "./routes/stories.js"
import chatRoutes from './routes/chat.js';
import recommendRoutes from './routes/recommend.js';
import cors from "cors";
import cookieParser from "cookie-parser";
import multer from "multer";
import { sendOfflineMessage } from "./controllers/chat.js";

global.emailCode = [];
global.registerEmailCode = [];

//middlewares
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);
  next();
});
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
  })
);
app.use(cookieParser());

// 文字聊天server部分
const server = createServer(app);
server.listen(8801);
const ws = new io.Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true
  }
});
const uidTosid = [];
//监听链接后的事件
ws.on("connection", (socket) => {
  console.log('connect', socket.id);
  //监听聊天发信息
  socket.on('sendMsg', (...msgData) => {
    console.log('sendMsg', msgData[0]);
    const toSocketId = uidTosid[msgData[0]?.toId];
    toSocketId ?
      socket.to(toSocketId).emit('receiveMsg', msgData[0]) :
      sendOfflineMessage(msgData[0]);
  })
  //监听发起视频聊天
  socket.on('sendVideo', (data) => {
    console.log('sendVideo', data);
    const videoToSocketId = uidTosid[data?.toId];
    videoToSocketId &&
      //向被发起人通知
      socket.to(videoToSocketId).emit('receiveVideo', data);
  })
  //监听视频被发起人接受与否
  socket.on('acceptVideo', (data) => {
    console.log('acceptVideo', data);
    const videoFromSocketId = uidTosid[data?.fromId];
    videoFromSocketId &&
      //通知发起人对方是否接受
      socket.to(videoFromSocketId).emit('fromAcceptVideo', data);
  })
  //监听挂断视频聊天
  socket.on('sendHangupVideo', (data) => {
    console.log('sendHangupVideo', data);
    const hangupVideoToSocketId = uidTosid[data?.hangupToId];
    hangupVideoToSocketId &&
      //通知对方视频聊天已挂断
      socket.to(hangupVideoToSocketId).emit('acceptHangupVideo', data);
  })
  //客户端链接时，将uid和socketid对应上
  socket.on('userIdToSocketId', (...data) => {
    console.log('userIdToSocketId', [data[0].userId, socket.id]);
    const userId = data[0]?.userId
    uidTosid[userId] = socket.id;
  })
  //客户端关闭连接，清除对应uid的socketid值
  socket.on('disconnect', () => {
    //关闭连接从uidTosid数组中移除
    const disconnectIndex = uidTosid.findIndex(disconnectSocketId => (
      socket.id === disconnectSocketId
    ));
    uidTosid[disconnectIndex] = undefined;
  })
})
//视频聊天socket服务器
const videoServer = createServer(app);
videoServer.listen(8802);
const vs = new io.Server(videoServer, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true
  }
});
const uidTovid = [];
vs.on('connection', socket => {
  // When someone attempts to join the room
  console.log('connectionVideo', socket.id);
  socket.on('join-room', (uId, userId) => {
    console.log('join-room', uidTovid[uId]);
    socket.to(uidTovid[uId]).emit('user-connected', userId);
    // Communicate the disconnection
  });
  //客户端链接时，将uid和socketid对应上
  socket.on('userIdToVideoSocketId', (data) => {
    console.log('userIdToVideoSocketId', [data.userId, socket.id]);
    const userId = data?.userId
    uidTovid[userId] = socket.id;
  })
  //客户端关闭连接，清除对应uid的socketid值
  socket.on('disconnect', () => {
    //关闭连接从uidTovid数组中移除
    const disconnectIndex = uidTovid.findIndex(disconnectSocketId => (
      socket.id === disconnectSocketId
    ));
    uidTovid[disconnectIndex] = undefined;
  })
})

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/relationships", relationshipRoutes);
app.use("/api/stories", stories);
app.use("/api/chat", chatRoutes);
app.use("/api/recommend", recommendRoutes);

app.listen(8800, () => {
  console.log("API working!");
});
