import express from "express";
import { getFriends } from "../controllers/chat.js";

const router = express.Router()

router.get("/:id", getFriends)


export default router