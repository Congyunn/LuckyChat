import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const getCommonFriends = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("未登陆!");

    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) return res.status(403).json("权限校验失败!");

        const q = req.query?.list == 'true' ?
            `SELECT u.id, u.name, u.profilePic, u.online, u.desc, u.gender, u.city, u.brithday, s.count FROM users AS u RIGHT JOIN 
            (SELECT *,count(*) AS count  FROM (SELECT r.followedUserid FROM relationships as r WHERE (r.followerUserid IN 
            (SELECT r.followedUserid FROM relationships as r WHERE r.followerUserid = ?))) AS f
            WHERE f.followedUserid != ?
            AND f.followedUserid NOT IN (SELECT r.followedUserid FROM relationships as r WHERE r.followerUserid = ?)
            GROUP BY followedUserid
            ORDER BY count DESC) as s ON u.id = s.followedUserid`:
            `SELECT u.id, u.name, u.profilePic FROM users AS u WHERE u.id IN (SELECT * FROM 
            (SELECT DISTINCT r.followedUserid FROM relationships as r WHERE (r.followerUserid IN 
            (SELECT r.followedUserid FROM relationships as r WHERE r.followerUserid = ?))) AS f
            WHERE f.followedUserid != ? 
            AND f.followedUserid NOT IN (SELECT r.followedUserid FROM relationships as r WHERE r.followerUserid = ?))
            ORDER BY RAND() LIMIT 2;`;

        db.query(q, [req.query?.id, req.query?.id, req.query?.id], (err, data) => {
            if (err) return res.status(500).json("查询共同好友失败");
            return res.status(200).json(data);
        });
    });
};

export const getInterestFriends = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("未登陆!");

    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) return res.status(403).json("权限校验失败!");

        const q = req.query?.list == 'true' ?
            `SELECT u.id, u.name, u.profilePic, u.online, u.desc, u.gender, u.city, u.brithday, s.count FROM users AS u RIGHT JOIN 
            (SELECT *,count(*) AS count  FROM (SELECT r.followedUserid FROM relationships as r WHERE (r.followerUserid IN 
            (SELECT r.followedUserid FROM relationships as r WHERE r.followerUserid = ?))) AS f
            WHERE f.followedUserid != ?
            AND f.followedUserid NOT IN (SELECT r.followedUserid FROM relationships as r WHERE r.followerUserid = ?)
            GROUP BY followedUserid
            ORDER BY count DESC) as s ON u.id = s.followedUserid`:
            `SELECT u.id, u.name, u.profilePic FROM users AS u WHERE u.id IN (SELECT * FROM 
            (SELECT DISTINCT r.followedUserid FROM relationships as r WHERE (r.followerUserid IN 
            (SELECT r.followedUserid FROM relationships as r WHERE r.followerUserid = ?))) AS f
            WHERE f.followedUserid != ? 
            AND f.followedUserid NOT IN (SELECT r.followedUserid FROM relationships as r WHERE r.followerUserid = ?))
            ORDER BY RAND() LIMIT 2;`;

        db.query(q, [req.query?.id, req.query?.id, req.query?.id], (err, data) => {
            if (err) return res.status(500).json("查询共同好友失败");
            return res.status(200).json(data);
        });
    });
};