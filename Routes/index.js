const express=require("express")
const router=express.Router();
const ApplicationRoute=require("./ApplicationRouter")
const intern=require("./InternshipRouter")
const job=require("./JobRoute")
const admin=require("./Admin")
const subscribe=require("./Payment")

router.get("/",(req,res)=>{
    res.send("This is backend")
})

router.use("/application",ApplicationRoute);
router.use("/internship",intern);
router.use("/job",job);
router.use("/admin",admin);
router.use("/subscribe",subscribe);

module.exports=router;