const express = require("express");
const router = express.Router();
const db = require("../Config/database")

router.get("/",async (req, res) => {
  try{
 const result =await db.query(`SELECT * FROM "public"."ALBUMS" JOIN "public"."TYPE_ALBUMS" ON "ALBUMS"."Albums_Type_ID" = "TYPE_ALBUMS"."Type_Albums_ID"`)
  res.json(result.rows)
  }catch(err){
    console.error("Có lỗi xảy ra",err)
    res.status(404).json(err)
  }
 
});

router.get("/:id",async (req, res) => {
  try{
  const id = req.params.id;
  const result = await db.query(`SELECT * FROM "ALBUMS" JOIN "TYPE_ALBUMS" ON "TYPE_ALBUMS"."Type_Albums_ID" = "ALBUMS"."Albums_Type_ID" WHERE "ALBUMS"."Albums_ID" = $1`,[id])
  res.json(result.rows)
  }catch(err){
    console.error("Có lỗi xảy ra",err)
    res.status(404).json(err)
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
