import { db } from "../connect.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { send } from "./sendEmail.js";

export const register = (req, res) => {
  //CHECK USER IF EXISTS

  const q = "SELECT * FROM users WHERE username = ?";

  db.query(q, [req.body.username], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length) return res.status(409).json("该用户名已经被注册过！");
    if (!global.registerEmailCode?.filter(item => (
      (item?.username == req.body.username) && (Number(item?.emailCode) == Number(req.body.emailCode))
    ))?.length) { return res.status(400).json("邮箱验证码或用户名错误！"); }
    //CREATE A NEW USER
    //Hash the password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);

    const q =
      "INSERT INTO users (`username`,`email`,`password`,`name`) VALUE (?)";

    const values = [
      req.body.username,
      req.body.email,
      hashedPassword,
      req.body.name,
    ];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("注册账号成功！");
    });
  });
};

export const login = (req, res) => {
  //邮箱登陆
  if (req.query?.type == 'email') {
    const q = `SELECT * FROM users WHERE email = ?`;
    db.query(q, [req.body.email], (err, data) => {
      if (err) return res.status(500).json(err);
      if (data.length === 0) return res.status(404).json("User not found!");
      const checkCode = (req.body.code == global.emailCode[data[0]?.id]);
      if (!checkCode)
        return res.status(400).json("邮箱验证码错误！");
      const token = jwt.sign({ id: data[0].id }, "secretkey");
      const { password, ...others } = data[0];
      res
        .cookie("accessToken", token, {
          httpOnly: true,
        })
        .status(200)
        .json(others);
    })
  }
  //账号密码登录 
  else {
    const q = `SELECT * FROM users WHERE username = ?`;
    db.query(q, [req.body.username], (err, data) => {
      if (err) return res.status(500).json(err);
      if (data.length === 0) return res.status(404).json("User not found!");
      const checkPassword = bcrypt.compareSync(
        req.body.password,
        data[0].password
      );
      if (!checkPassword)
        return res.status(400).json("用户名或密码错误!");
      const token = jwt.sign({ id: data[0].id }, "secretkey");
      const { password, ...others } = data[0];
      res
        .cookie("accessToken", token, {
          httpOnly: true,
        })
        .status(200)
        .json(others);
    });
  }
};

export const changeOnline = (req, res) => {
  const q = `UPDATE users SET online = 'true' WHERE username = ?`;

  db.query(q, [req.body.username], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length === 0) return res.status(404).json("User not found!");
    res
      .status(200)
      .json(data);
  });
};

export const logout = (req, res) => {
  res.clearCookie("accessToken", {
    secure: true,
    sameSite: "none"
  }).status(200).json("User has been logged out.")
};

export const changeOffline = (req, res) => {
  const q = `UPDATE users SET online = 'false' WHERE username = ?`;

  db.query(q, [req.body.username], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length === 0) return res.status(404).json("User not found!");
    res
      .status(200)
      .json(data);
  });
};

export const sendEmail = (req, res) => {
  const q = `SELECT * FROM users WHERE email = ?`;

  db.query(q, [req.query?.email], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length === 0) return res.status(404).json("未找到该用户!");
    //随机生成6位数字
    const emailCode = (function captchaNumber () {
      let num = [];
      for (let i = 0; i < 6; i++) {
        num[i] = parseInt(Math.random() * 10);
      }
      return num.join('');
    })()
    const email = {
      title: '幸运聊网络社交平台---邮箱验证码',
      body: `
                <h1>您好：</h1>
                <p style="font-size: 18px;color:#000;">
                    您的验证码为：
                    <span style="font-size: 16px;color:#f00;"> ${emailCode}， </span>
                    您当前正在幸运聊网络社交平台登陆，验证码告知他人将会导致数据信息被盗，请勿泄露
                </p>
                <p style="font-size: 1.5rem;color:#999;">5分钟内有效</p>
                `
    }
    const emailCotent = {
      from: '3316229105@qq.com', // 发件人地址
      to: req.query?.email, // 收件人地址，多个收件人可以使用逗号分隔
      subject: email.title, // 邮件标题
      html: email.body // 邮件内容
    };
    send(emailCotent);
    global.emailCode[data[0]?.id] = emailCode;
    //五分钟后过期
    setTimeout(() => {
      global.emailCode[data[0]?.id] = undefined;
    }, 300000);
  });
}

export const sendRegisterEmail = (req, res) => {
  const q = "SELECT * FROM users WHERE email = ?";

  db.query(q, [req.query?.email], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length) return res.status(409).json("该邮箱已被注册！");
    //随机生成6位数字
    const emailCode = (function captchaNumber () {
      let num = [];
      for (let i = 0; i < 6; i++) {
        num[i] = parseInt(Math.random() * 10);
      }
      return num.join('');
    })()
    const email = {
      title: '幸运聊网络社交平台---邮箱验证码',
      body: `
                <h1>您好：</h1>
                <p style="font-size: 18px;color:#000;">
                    您的验证码为：
                    <span style="font-size: 16px;color:#f00;"> ${emailCode}， </span>
                    您当前正在注册幸运聊网络社交平台账号，验证码告知他人将会导致数据信息被盗，请勿泄露
                </p>
                <p style="font-size: 1.5rem;color:#999;">单次注册且当前用户名有效</p>
                `
    }
    const emailCotent = {
      from: '3316229105@qq.com', // 发件人地址
      to: req.query?.email, // 收件人地址，多个收件人可以使用逗号分隔
      subject: email.title, // 邮件标题
      html: email.body // 邮件内容
    };
    send(emailCotent);
    global.registerEmailCode.push({ username: req.query?.username, emailCode });
  });
}
