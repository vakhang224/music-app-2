const express = require("express")
const router= express()

router.get("/",(req,res)=>{

    res.send("User list")

})

router.post("/",(req,res)=>{
    res.send("create User")
})

router.get("/:id",(req,res)=>{
    res.send(`get User with ID  ${req.params.id}`)
})


router.put("/:id",(req,res)=>{
    res.send(`get User with ID  ${req.params.id}`)
})


router.delete("/:id",(req,res)=>{
    res.send(`get User with ID  ${req.params.id}`)
})

module.exports = router