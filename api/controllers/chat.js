import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import moment from "moment";
import * as fs from "fs";

export const getFriends = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");

    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!");

        const q =
            req.query?.type == 'online' ?
                `SELECT u.id, u.profilePic, u.username, u.desc, u.name FROM users AS u 
                    JOIN relationships AS r ON (u.id = r.followedUserId) 
                    WHERE ? = r.followerUserId 
                    AND u.online = 'true'`:
                req.query?.type == 'offline' ?
                    `SELECT u.id, u.profilePic, u.username, u.desc, u.name FROM users AS u 
                    JOIN relationships AS r ON (u.id = r.followedUserId) 
                    WHERE ? = r.followerUserId 
                    AND u.online = 'false'`:
                    `SELECT u.id, u.profilePic, u.username, u.desc, u.name, u.brithday FROM users AS u 
                    JOIN relationships AS r ON (u.id = r.followedUserId) 
                    WHERE ? = r.followerUserId`

        db.query(q, [userInfo.id], (err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json(data);
        });
    });
};

export const fetchMessage = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");
    if (!req.query?.fromId || !req.query?.toId) {
        return res.status(401).json("发收信人ID缺失")
    }
    jwt.verify(token, "secretkey", (err) => {
        if (err) return res.status(403).json("Token is not valid!");

        const q = `SELECT * FROM chat AS c 
                    WHERE (fromId = ? AND toId = ?) OR (fromId = ? AND toId = ?)
                    ORDER BY c.createdAt`;
        const sqlParams = [
            Number(req.query.fromId), Number(req.query.toId),
            Number(req.query.toId), Number(req.query.fromId)
        ];
        db.query(q, sqlParams, (err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json(data);
        });
    });
};

export const getOfflineMsg = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");
    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!");
        const q = `SELECT * FROM offlineMessages AS o 
                    WHERE toId = ? AND readed = 'false'`;
        db.query(q, userInfo?.id, (err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json(data);
        });
    });
};

export const putOfflineMsg = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");
    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!");
        const q = `UPDATE offlineMessages SET readed = 'true' WHERE (fromId = ? AND toId = ?)`;
        db.query(q, [req.body.fromId, userInfo.id], (err, data) => {
            if (err) return res.status(500).json(err);
            if (data.length === 0) return res.status(404).json("User not found!");
            res
                .status(200)
                .json(data);
        });
    });
};

export const sendMessage = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");

    jwt.verify(token, "secretkey", (err) => {
        if (err) return res.status(403).json("Token is not valid!");
        console.log(req.file);
        const q = "INSERT INTO chat (`fromId`,`toId`,`createdAt`,`msg`, `isImage`, `isAudio`, `audio`) VALUE (?)";
        const values = [
            req.body.fromId,
            req.body.toId,
            moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
            req.body.msg,
            req.body.isImage,
            req.body.isAudio,
            req?.file?.filename
        ];
        db.query(q, [values], (err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json(data);
        });
    });
}

export const sendOfflineMessage = (offlineMsg) => {
    const { fromId, toId, msg, isImage } = offlineMsg;
    const q = "INSERT INTO offlineMessages (`fromId`,`toId`,`createdAt`,`msg`, `isImage`, `readed`) VALUE (?)";
    const values = [
        fromId,
        toId,
        moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
        msg,
        isImage,
        'false'
    ];
    db.query(q, [values]);
}

export const getChatAudio = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");
    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!");
        const path = `../file/chatAudios/${req.query?.filename}`;
        fs.readFile(path, function (err, data) {
            if (err) {
                res.send('读取错误');
            } else {
                res.setHeader("Content-Type", 'audio/x-ms-wax');
                res.send(data);
            }
        })
    });
};