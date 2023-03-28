import express from "express";
import { login,register,logout,changeOnline,changeOffline } from "../controllers/auth.js";

const router = express.Router()

router.post("/login", login)
router.put("/login", changeOnline)
router.post("/register", register)
router.post("/logout", logout)
router.put("/logout", changeOffline)


export default router