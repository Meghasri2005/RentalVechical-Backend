const express=require('express')
const AdminRouter=express.Router()

const {getAllUsers,
  toggleBlockUser,
  getAllOwners,
  getPendingVehicles,
  approveVehicle,
  getAllBookings,
  cancelBooking,
  addPricingCategory,
  deleteCategory,
  getAnalytics,
  getStats}=require("../controllers/Admin")
const {Protect}=require("../middlewares/protect")
const {adminAuth}=require("../middlewares/AdminAuth")

AdminRouter.get("/users",Protect,adminAuth,getAllUsers)
AdminRouter.post("/block-user", Protect, adminAuth, toggleBlockUser)
AdminRouter.get("/owners", Protect, adminAuth, getAllOwners)

AdminRouter.get("/pending-vehicles", Protect, adminAuth, getPendingVehicles)
AdminRouter.post("/approve-vehicle", Protect, adminAuth, approveVehicle)

AdminRouter.get("/bookings", Protect, adminAuth, getAllBookings)
AdminRouter.post("/cancel-booking", Protect, adminAuth, cancelBooking)

AdminRouter.post("/add-category", Protect, adminAuth, addPricingCategory)
AdminRouter.post("/delete-category", Protect, adminAuth, deleteCategory)

AdminRouter.get("/analytics", Protect, adminAuth, getAnalytics)
AdminRouter.get("/stats", Protect, adminAuth, getStats)





module.exports=AdminRouter;