const User=require("../models/UserModel")
const Vechical=require("../models/Vechicals")
const Booking=require("../models/Bookings")

const dashboard=async (req,res)=>{
    try{
        const {_id}=req.user;
        console.log("USER ID:", _id);
        if(req.user.role!=="Owner")
        {
            return res.status(400).json({
                success:false,
                message:"you are not owner"
            })
        }

        const Vechs=await Vechical.find({owner:_id});
        const Cars=await Vechical.find({owner:_id,vechicalType:"Car"});
        const Bikes=await Vechical.find({owner:_id,vechicalType:"Bike"});
        const Autos=await Vechical.find({owner:_id,vechicalType:"Auto"});
        const Scooters=await Vechical.find({owner:_id,vechicalType:"Scooter"});
        
        const Bookings=await Booking.find({owner:_id}).populate("Vechical user").sort({createdAt:-1});
        const pendingBooking=await Booking.find({owner:_id,status:"Pending"})
        const completedBooking=await Booking.find({owner:_id,status:"Confirmed"})
        console.log(completedBooking);
        
        //monthly revenue
        const montlyRevenue=Bookings.slice().filter(booking=>booking.status=='Confirmed').reduce((acc,booking)=>acc+booking.price,0);
        return res.status(200).json({
            success:true,
            message:"owner dashboard",
            dashboardData:{
                totalVechicals:Vechs.length,
                totalCars:Cars.length,
                totalBikes:Bikes.length,
                totalAutos:Autos.length,
                totalScooters:Scooters.length,
                totalBookings:Bookings.length,
                pendingBooking:pendingBooking.length,
                completedBooking:completedBooking.length,
                recentBookings:Bookings.slice(0,3),
                monthlyRevenue:montlyRevenue
            }
             
        })
    }
    catch(err)
    {
        return res.status(500).json({
            success:false,
            message:"error in server"
        })
    }
    


}
module.exports={dashboard}