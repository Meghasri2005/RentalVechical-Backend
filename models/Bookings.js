const mongoose=require("mongoose");

//schema
const BookingSchema=mongoose.Schema({
    Vechical:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Vechical",
        required:true,
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    pickupDateTime:{
        type:Date,
        required:true,
    },
    returnDateTime: {
        type:Date,
        required: true
    },
    status:{
        type:String,
        enum:["Pending","Confirmed","Cancelled"],
        default:"Pending"
    },
    price:{
        type:Number,
        required:true,
    }
},{timestamps:true})
module.exports=mongoose.model("Booking",BookingSchema)
