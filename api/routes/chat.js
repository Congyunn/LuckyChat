import express from "express";
import multer from "multer";
import {
    getFriends,
    sendMessage,
    fetchMessage,
    getOfflineMsg,
    putOfflineMsg,
    getChatAudio
} from "../controllers/chat.js";

const router = express.Router()

router.get("/audio", getChatAudio)
router.get("/msg", fetchMessage)
router.get("/offlineMsg", getOfflineMsg)
router.put("/offlineMsg", putOfflineMsg)
router.get("/:id", getFriends)
router.post("/msg", multer({ dest: '../file/chatAudios/' }).single('audio'), sendMessage)


export default router