const express = require("express");
const router = express.Router();
const db = require("../Config/database")
router.get("/", async (req, res) => {
  try{
    const result =  await db.query('SELECT * FROM "ARTISTS" as a JOIN "public"."USERS" as us ON a."Artist_ID" = us."User_ID"')
    res.json(result.rows);
  }catch(err){
    console.error("Lỗi rồi bạn eh")
    res.status(404).json("Lỗi rồi bạn eh",err)
  }
});

router.get("/:id", async (req, res) => {
  const id = req.params.id
  console.log(id)
  try{
    const result =  await db.query('SELECT * FROM "ARTISTS" as a INNER JOIN "public"."USERS" as us ON a."Artist_ID" = us."User_ID" WHERE a."Artist_ID" = $1',[id])
    res.json(result.rows);
  }catch(err){
    console.error("Lỗi rồi bạn eh")
    res.status(404).json("Lỗi rồi bạn eh",err)
  }
});


router.post("/", (req, res) => {
  res.json("create artist");
});

router.put("/:id", (req, res) => {
  res.json("edit artist");
});

router.delete("/:id", (req, res) => {
  res.json("delete artist");
});

module.exports = router;
