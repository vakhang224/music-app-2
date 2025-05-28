const express = require("express");
const db = require("../Config/database");
const router = express.Router();
const varifyToken = require("../MiddleWare/varifyToken");

async function checkIfUserExists(id) {
  const result = await pool.query('SELECT 1 FROM users WHERE id = $1 LIMIT 1', [id]);
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


router.put("/:id",varifyToken, (req, res) => {
  res.json("edit");
});

router.delete("/:id",varifyToken, (req, res) => {
  res.json("delete");
});

module.exports = router;
