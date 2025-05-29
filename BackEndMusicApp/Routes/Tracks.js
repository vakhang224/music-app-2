const express = require("express");
const router = express.Router();
const db = require("../Config/database")
router.get("/",async (req, res) => {
  try{
    const results = await db.query(`SELECT * FROM "TRACKS" JOIN "SONGS" ON "TRACKS"."Song_ID" = "SONGS"."Song_ID"`)
    res.json(results.rows)
  }catch(err){
    console.error("Lỗi không lấy được dữ liệu của TRACKS")
    res.status(505).json(err)
  } 
});

router.get("/:id", (req, res) => {
  const id = req.params.id;
  res.json({
    users: `Tracks ${id}`,
  });
});

router.post("/", (req, res) => {
  res.json("create track");
});

router.put("/:id", (req, res) => {
  res.json("edit track");
});

router.delete("/:id", (req, res) => {
  res.json("delete track");
});

module.exports = router;
