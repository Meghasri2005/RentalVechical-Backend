const express=require('express')
const userRouter=express.Router()

const {Login,getData}=require("../controllers/Login")
const {Signup,uploadImage}=require("../controllers/Signup")
const {RoleChange}=require("../controllers/Vechical")
const {Protect}=require("../middlewares/protect")
const {userBookings}=require("../controllers/Bookings");
const {upload}=require("../middlewares/Multer")

userRouter.post("/upload",upload.single("image"),Protect,uploadImage);
userRouter.post("/login",Login)
userRouter.post("/signup",Signup)
userRouter.get("/data",Protect,getData)
userRouter.post("/rolechange",Protect,RoleChange)
userRouter.get("/bookings",Protect,userBookings)


module.exports=userRouter;