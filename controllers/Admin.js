const User=require("../models/UserModel")
const Vechical=require("../models/Vechicals")
const Booking=require("../models/Bookings")
const Pricing=require("../models/Pricing")

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password")
    res.json({ success: true, users })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

const toggleBlockUser = async (req, res) => {
  try {
    const { userId } = req.body

    const user = await User.findById(userId)
    user.isBlocked = !user.isBlocked
    await user.save()

    res.json({
      success: true,
      message: user.isBlocked ? "User Blocked" : "User Unblocked"
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

const getAllOwners = async (req, res) => {
  try {
    const owners = await User.find({ role: "Owner" })

    const agencies = await Promise.all(
      owners.map(async (owner) => {

        const vehicleCount = await Vechical.countDocuments({
          owner: owner._id
        })

        return {
          _id: owner._id,
          name: owner.name,
          email: owner.email,
          vehicleCount
        }
      })
    )

    res.json({
      success: true,
      agencies
    })

    
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

const getPendingVehicles = async (req, res) => {
  try {
    const vehicles = await Vechical.find({ status:"Pending"})
    res.json({ success: true, vehicles })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

const approveVehicle = async (req, res) => {
  try {

    const { vehicleId,  status } = req.body

    // 1️⃣ Validate required fields
    if (!vehicleId ||!status) {
      return res.status(400).json({
        success: false,
        message: "Vehicle ID and status are required"
      })
    }

    

    const vehicle = await Vechical.findById(vehicleId)

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found"
      })
    }

    // 3️⃣ If approving
    

      // const Category = await Pricing.find({name:category})

      // if (!Category) {
      //   return res.status(404).json({
      //     success: false,
      //     message: "Pricing category not found"
      //   })
      // }

      // // 🔥 IMPORTANT: BASE PRICE COMPARISON
      // if (vehicle.pricePerDay < Category.basePricePerDay) {
      //   return res.status(400).json({
      //     success: false,
      //     message: `Vehicle price (${vehicle.pricePerDay}) is lower than minimum category price (${category.basePricePerDay})`
      //   })
      // }

      // // Optional: prevent extreme overpricing
      // if (vehicle.pricePerDay > category.basePricePerDay * 3) {
      //   return res.status(400).json({
      //     success: false,
      //     message: "Vehicle price is too high for this category"
      //   })
      // }

     
      vehicle.status = status;
    

   

    await vehicle.save()

    res.status(200).json({
      success: true,
      message: `Vehicle status successfully`,
      vehicle
    })
    
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user")
      .populate("Vechical")

    res.json({ success: true, bookings })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}


const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.body

    await Booking.findByIdAndUpdate(bookingId, {
      status: "Cancelled"
    })

    res.json({ success: true, message: "Booking Cancelled" })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

const addPricingCategory = async (req, res) => {
  try {
    const { category, basePrice,commissionPercentage} = req.body

    await Pricing.create({ category, basePrice ,commissionPercentage})

    res.json({ success: true, message: "Category Added" })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.body

    await Pricing.findByIdAndDelete(id)

    res.json({ success: true, message: "Category Deleted" })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

const getAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments()
    const totalVehicles = await Vechical.countDocuments()
    const totalBookings = await Booking.countDocuments()

    const revenue = await Booking.aggregate([
      { $match: { status: "Confirmed" } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalPrice" }
        }
      }
    ])

    res.json({
      success: true,
      totalUsers,
      totalVehicles,
      totalBookings,
      totalRevenue: revenue[0]?.totalRevenue || 0
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

const getStats = async (req, res) => {
  try {
    const users = await User.countDocuments()
    const agencies = await User.countDocuments({ role: "Owner" })
    const pendingVehicles = await Vechical.countDocuments({ status: "Pending" })
    const bookings = await Booking.countDocuments()

    res.json({
      success: true,
      stats: { users, agencies, pendingVehicles, bookings }
    })
  } catch (err) {
    res.json({ success: false, message: err.message })
  }
}
module.exports={getAllUsers,toggleBlockUser,getAllOwners,getPendingVehicles,approveVehicle,getAllBookings,cancelBooking,addPricingCategory,deleteCategory,getAnalytics,getStats};