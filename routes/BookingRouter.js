const express=require('express');
const BookingRouter=express.Router();


const {checkAvailabilityOfVech,creatingBooking}=require("../controllers/Bookings");
const {Protect}=require("../middlewares/protect")


BookingRouter.post("/create",Protect,creatingBooking)


module.exports=BookingRouter