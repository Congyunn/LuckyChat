import express from "express";
import { getCommonFriends, getInterestFriends } from "../controllers/recommend.js";

const router = express.Router()

router.get("/common", getCommonFriends);
router.get("/interest", getInterestFriends);


export default router