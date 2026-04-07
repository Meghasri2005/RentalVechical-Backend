const User=require("../models/UserModel")
const Vechical=require("../models/Vechicals")
const Booking=require("../models/Bookings")


//checking that the cars are booted in that time period
const checkAvailability=async(id,pickupDateTime,returnDateTime)=>{
    
        //checking that all cars are in booking
        const bookings=await Booking.findOne({
                            Vechical:id,
                            status: { $in: ["Pending", "Confirmed"] },
                            pickupDateTime:{$lte:returnDateTime},
                            returnDateTime:{$gte:pickupDateTime}
                        });
    
        return !bookings;
        
    
}

//checking availability of cars in that destination in given date
const checkAvailabilityOfVech=async(req,res)=>{
    try{
        const {location,pickupDateTime,returnDateTime}=req.body;

        if(!location||!pickupDateTime||!returnDateTime)
        {
            return res.status(400).json({
                success:false,
                message:"every thing is needed"
            })
        }


        const Vechs=await Vechical.find({location:{ $regex: new RegExp(`^${location.trim()}$`, "i") },isAvailable:true})
       

        const pickup = new Date(pickupDateTime);
        const drop = new Date(returnDateTime);

        const availabilityVechPromises = Vechs.map(async (vech) => {
            const isAvailable = await checkAvailability(vech._id, pickup, drop);
            return { ...vech._doc, isAvailable };
        });


        const availableVechs = (await Promise.all(availabilityVechPromises)).filter(vechs => vechs.isAvailable);



        console.log("AVAILABLE Vechicals:", availableVechs);
         

        
        
        return res.status(201).json({
            success:true,
            availableVechs
        })

    }
    catch(err){
        return res.status(500).json({
            success:false,
            message: err.message,
            
        })
    }
}


const creatingBooking=async(req,res)=>{
    
    try{
        const {_id}=req.user;
        const {vech,pickupDateTime,returnDateTime}=req.body;

        console.log(vech,_id,pickupDateTime,returnDateTime)
        if(!vech||!pickupDateTime||!returnDateTime)
        {
            return res.status(400).json({
                success:false,
                message:"all feilds are required"
            })
        }

        const isVechAvailable=await checkAvailability(vech,pickupDateTime,returnDateTime);
        console.log("IS vech AVAILABLE:", isVechAvailable);
        const VechData=await Vechical.findById(vech);
        console.log("Vech DATA:", VechData);
        if(!isVechAvailable)
        {
            return res.json({
                success:false,
                message:"Cars are not available"
            })
        }
        //calculating prices
        const pickuped=new Date(pickupDateTime);
        const returned=new Date(returnDateTime);
        const noofDays=Math.ceil((returned-pickuped)/(1000*60*60*24));
        const price=(VechData.pricePerDay*noofDays);


        const createdBooking =await Booking.create({
            Vechical:VechData._id,
            user:_id,
            owner:VechData.owner,
            price,
            pickupDateTime,
            returnDateTime,
            
        })
            return res.status(200).json({
                success:true,
                message:"booking created successfully",
                createdBooking
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

const userBookings=async(req,res)=>{
    try{
        const id=req.user._id;
        if(!id)
        {
            return res.json({
                success:false,
                message:"it need the id"
            })
        }

         const Bookings=await Booking.find({user:id}).populate("Vechical").sort({ createdAt:-1 });
        console.log(Bookings)
        if(!Bookings)
        {
            return res.json({
                success:false,
                message:"you didn't have bookings "
            })
        }

        return res.json({
                success:true,
                message:"user bookings are fetched",
                Bookings
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

const ownerBookings=async(req,res)=>{
    try{
        const id=req.user._id;
        if(!id)
        {
            return res.json({
                success:false,
                message:"it need the id"
            })
        }
        const verifiedOwner=await User.findById(id);
        if(verifiedOwner.role!=="Owner")
        {
            return res.json({
                success:false,
                message:"you are not owner"
            }) 
        }
        const data=await Booking.find({owner:id}).populate("Vechical user").select("-user.password").sort({createdAt:-1});
        if(!data)
        {
            return res.json({
                success:false,
                message:"you didn't have bookings till now"
            })
        }

        return res.json({
                success:true,
                message:"owner bookings are fetched",
                data
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

const changeBookingStatus=async(req,res)=>{
   try{
     const {BookingId,status}=req.body;
     console.log(BookingId,status)
    if(!BookingId||!status)
    {
        return res.json({
            success:false,
            message:"we need status,bookingId"
        })
    }
    const booking=await Booking.findById(BookingId)
    console.log(booking)
    const UpdatedStatus=await Booking.findByIdAndUpdate({_id:BookingId},{status:status},{ new: true }  )
    console.log(UpdatedStatus)
    const UpdatedVechical=await Vechical.findByIdAndUpdate({_id:booking.Vechical},{isAvailable:status==="Confirmed"?false:true},{ new: true }  )
    console.log(UpdatedVechical)

    return res.status(200).json({
            success:true,
            message:"Status changed to",
            UpdatedStatus,
            UpdatedVechical
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

module.exports={checkAvailabilityOfVech,creatingBooking,userBookings,ownerBookings,changeBookingStatus};