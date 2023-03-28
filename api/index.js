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
import cors from "cors";
import cookieParser from "cookie-parser";
import { sendOfflineMessage } from "./controllers/chat.js";

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

const server = createServer(app);
server.listen(8801);
const ws = new io.Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true
  }
});

const uidTosid = [];
ws.on("connection", (socket) => {
  console.log('connect', socket.id);
  socket.on('sendMsg', (...msgData) => {
    console.log('sendMsg', msgData[0]);
    const toSocketId = uidTosid[msgData[0]?.toId];
    toSocketId ?
      socket.to(toSocketId).emit('receiveMsg', msgData[0]) :
      sendOfflineMessage(msgData[0]);
  })
  socket.on('userIdToSocketId', (...data) => {
    console.log('userIdToSocketId', [data[0].userId, socket.id]);
    const userId = data[0]?.userId
    uidTosid[userId] = socket.id;
  })
  socket.on('disconnect', () => {
    //关闭连接从uidTosid数组中移除
    const disconnectIndex = uidTosid.findIndex(disconnectSocketId => (
      socket.id === disconnectSocketId
    ));
    uidTosid[disconnectIndex] = undefined;
  })
})

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/relationships", relationshipRoutes);
app.use("/api/stories", stories)
app.use("/api/chat", chatRoutes)

app.listen(8800, () => {
  console.log("API working!");
});
