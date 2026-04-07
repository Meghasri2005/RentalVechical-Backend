const express=require('express');
const ownerRouter=express.Router();




const {addVechical,allOwnerVechicals,getAllOwnerCars,getAllOwnerBikes,getAllOwnerAuto,getAllOwnerScooters,toggleAvailability,deleteVechical}=require('../controllers/Vechical')
const {ownerBookings,changeBookingStatus}=require("../controllers/Bookings");
const {dashboard}=require("../controllers/Owner")

const {Protect}=require("../middlewares/protect")
const {upload}=require("../middlewares/Multer")


ownerRouter.post("/addvechical",upload.single("image"),Protect,addVechical);
ownerRouter.get("/ownervechicals",Protect,allOwnerVechicals)
ownerRouter.get("/cars",Protect,getAllOwnerCars)
ownerRouter.get("/bikes",Protect,getAllOwnerBikes)
ownerRouter.get("/autos",Protect,getAllOwnerAuto)
ownerRouter.get("/scooters",Protect,getAllOwnerScooters)
ownerRouter.get("/bookings",Protect,ownerBookings)
ownerRouter.post("/changeStatus",changeBookingStatus)
ownerRouter.get("/dashboard",Protect,dashboard)
ownerRouter.post("/toggleAvailiable/:id",toggleAvailability)
ownerRouter.post("/delete/:id",deleteVechical)



module.exports=ownerRouter;
