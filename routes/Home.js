const express=require('express');
const router=express.Router();

const {getVechical,getallvechicals,getallcars,getallbikes,getallautos,getallscooters,getalllocations}=require('../controllers/Vechical')
const {checkAvailabilityOfVech}=require("../controllers/Bookings");

router.get("/vechicals",getallvechicals)
router.get("/cars",getallcars)
router.get("/bikes",getallbikes)
router.get("/autos",getallautos)
router.get("/scooters",getallscooters)
router.post("/available",checkAvailabilityOfVech);
router.get("/locations",getalllocations)
router.get("/:id",getVechical);

module.exports=router