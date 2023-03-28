import express from "express";
import {
    getFriends,
    sendMessage,
    fetchMessage,
    getOfflineMsg,
    putOfflineMsg
} from "../controllers/chat.js";

const router = express.Router()

router.get("/msg", fetchMessage)
router.get("/offlineMsg", getOfflineMsg)
router.put("/offlineMsg", putOfflineMsg)
router.get("/:id", getFriends)
router.post("/msg", sendMessage)


export default router