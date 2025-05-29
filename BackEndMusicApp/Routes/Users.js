const express = require("express");
const db = require("../Config/database");
const router = express.Router();
const varifyToken = require("../MiddleWare/varifyToken");

async function checkIfUserExists(id) {
  const result = await db.query('SELECT 1 FROM users WHERE id = $1 LIMIT 1', [id]);
  return result.rowCount > 0;
}

router.get("/",varifyToken, async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM "public"."USERS"');
    res.json(result.rows);
  } catch (err) {
    console.error('Query error', err);
    res.status(500).send('Internal Server Error');
  }
});

router.get("/:id",varifyToken, async (req, res) => {
  const id = decodeURIComponent(req.params.id);
  console.log(id)
  try {
    const result = await db.query('SELECT * FROM "public"."USERS" as us WHERE us."User_ID" = $1', [id]);
    res.json(result.rows);
  } catch (err) {
    console.error('Query error', err);
    res.status(500).send('Internal Server Error');
  }
});

router.put("/:id", varifyToken, async (req, res) => {
  const userId = req.params.id;
  const { Name_User, Email, Account_ID } = req.body;

  if (!Name_User || !Email || !Account_ID) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Cập nhật USERS với Name_User
    await db.query(
      `UPDATE public."USERS"
       SET "Name_User" = $1
       WHERE "User_ID" = $2`,
      [Name_User, userId]
    );

    // Cập nhật ACCOUNT với Email
    await db.query(
      `UPDATE public."ACCOUNT"
       SET "Email" = $1, "updateAt" = NOW()
       WHERE "Account_ID" = $2`,
      [Email, Account_ID]
    );

    res.status(200).json({ message: "User name and email updated successfully" });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



router.delete("/:id",varifyToken, (req, res) => {
  res.json("delete");
});

module.exports = router;
