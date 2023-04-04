import express from "express";
import {
    login,
    register,
    logout,
    changeOnline,
    changeOffline,
    sendEmail,
    sendRegisterEmail
} from "../controllers/auth.js";

const router = express.Router()

router.get("/login/email", sendEmail)
router.post("/login", login)
router.put("/login", changeOnline)
router.get("/register/email", sendRegisterEmail);
router.post("/register", register)
router.post("/logout", logout)
router.put("/logout", changeOffline)


export default router