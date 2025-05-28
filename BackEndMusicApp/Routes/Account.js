const db = require("../Config/database");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const GenerateID = require("../Utils/generateID");
const jwt = require("jsonwebtoken");

async function checkPassword(id, password) {
  try {
    const result = await db.query(
      `SELECT password FROM "public"."ACCOUNT" WHERE "Account_ID" = $1`, [id]
    );
    if (result.rows.length === 0) {
      throw new Error('User not found');
    }
    const isMatch = await bcrypt.compare(password, result.rows[0].password);

    if (isMatch) {
      console.log("Mật khẩu chính xác!");
      return true; 
    } else {
      console.log("Mật khẩu sai.");
      return false;
    }

  } catch (err) {
    console.error('Lỗi khi kiểm tra mật khẩu', err);
    return false; 
  }
}
router.post("/login", async (req, res) => {
  const { userName, password } = req.body;

  if (!userName || !password) {
    return res.status(400).json({ message: 'Thiếu thông tin đăng nhập' });
  }

  try {
    const result = await db.query(
      `SELECT * FROM "public"."ACCOUNT" WHERE "Name_Account" = $1 OR "Email" = $1`,
      [userName]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Thông tin đăng nhập không chính xác' });
    }

    const account = result.rows[0];
    const isMatch = await bcrypt.compare(password, account.HashPassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'Thông tin đăng nhập không chính xác' });
    }

    const accountID = account.Account_ID;
    const userResult = await db.query(
      `SELECT * FROM "public"."USERS" WHERE "Account_ID" = $1`, [accountID]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'Người dùng không tồn tại' });
    }

    const user = userResult.rows[0];
    const userData = {
      User_ID: user.User_ID,
      Account_ID: user.Account_ID,
      Name_User: user.Name_User,
      Country: user.Country
    };

    const accessToken = jwt.sign(
      { accountID, userID: user.User_ID },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    const refreshToken = jwt.sign(
      { accountID, userID: user.User_ID },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    const expireDate = new Date(Date.now() + 30 * 60 * 1000).toISOString();

    return res.status(200).json({
      message: 'Đăng nhập thành công',
      accessToken,
      refreshToken,
      expireDate,
      userData
    });

  } catch (err) {
    console.error('Query error', err);
    return res.status(500).json({ message: 'Lỗi máy chủ' });
  }
});

router.post("/refresh", async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ message: "Thiếu refresh token" });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const newAccessToken = jwt.sign(
      { accountID: decoded.accountID, userID: decoded.userID },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const newExpireDate = new Date(Date.now() + 15 * 60 * 1000).toISOString();

    return res.status(200).json({
      accessToken: newAccessToken,
      expireDate: newExpireDate
    });
  } catch (err) {
    console.error("Lỗi xác thực refresh token:", err);
    return res.status(403).json({ message: "Refresh token không hợp lệ" });
  }
});


router.post('/SignUp', async (req, res) => {
  try {
    const { email, password, userName } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10); 
    
    const accountID = GenerateID();

    if(password=="" || email == "" || userName == ""){
      return res.status(400).json({message:"Thiếu thông tin đăng nhập"})
    }

    const result = await db.query(
      `SELECT * FROM "public"."ACCOUNT" WHERE "Name_Account" = $1 OR "Email" = $2`, [userName, email]
    );

    if (result.rows.length > 0) {
      return res.status(403).json({ message: 'Tài khoản hoặc email đã tồn tại' });
    }

    await db.query(
  `INSERT INTO public."ACCOUNT"(
	"Account_ID", "Name_Account", "HashPassword", "Email", "createAt")
	VALUES ($1, $2, $3, $4, $5);`,
      [accountID, userName, hashedPassword, email, new Date()]
    );
    
    const userID = GenerateID();
    const createdAt = new Date();
    const userDefaults = {
      Name_User: 'Người dùng mới',
      Country: 'Unknown',
      Gender: 'Không rõ',
      typeUsserID: "TU001",
      bio: '',
    };

    await db.query(
      `INSERT INTO public."USERS"(
	"User_ID", "Name_User", "Date_Create_AT","Country","Type_UserID","Account_ID","Gender",bio)
	VALUES ($1, $2, $3, $4, $5, $6, $7, $8);`,
      [
        userID,
        userDefaults.Name_User,
        createdAt,
        userDefaults.Country,
        userDefaults.typeUsserID,
        accountID,
        userDefaults.Gender,
        userDefaults.bio
      ] 
    );

    await db.query(`INSERT INTO public."LIBRARY"(
	"Library_ID", "Owner_ID")
	VALUES ($1, $2);`,[GenerateID(),userID]);

    res.status(201).json({
      message: 'Tạo tài khoản và người dùng thành công',
      Account_ID: accountID,
      User_ID: userID
    });

  } catch (err) {
    console.error('Lỗi:', err);
    res.status(500).json({ error: 'Tạo tài khoản thất bại', details: err.message });
  }
});

router.put("/:id", async (req, res) => {
  const id = decodeURIComponent(req.params.id);
  const { email, newPassword, currentPassword,userName} = req.body;

  try {
    if (!await checkPassword(id, currentPassword)) {
      return res.status(401).json({ message: "Mật khẩu hiện tại không chính xác" });
    }
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await db.query(
      `UPDATE "public"."ACCOUNT" SET email = $1, password = $2 WHERE "Account_ID" = $3`,
      [email, hashedNewPassword, id]
    );
    res.json({ message: "Cập nhật tài khoản thành công" });

  } catch (err) {
    console.error('Query error', err);
    res.status(500).send('Internal Server Error');
  }
});



module.exports = router;
