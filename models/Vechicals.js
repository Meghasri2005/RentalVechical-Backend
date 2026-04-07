const mongoose = require("mongoose");

const VechicalSchema = new mongoose.Schema({
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    vechicalType:{
        type:String,
        enum:["Car","Bike","Scooter","Auto"],
        required:true
    },
    model:{
        type: String,
        required: true,
    },
    brand:{
        type: String,
        required: true,
    },
    year: {
        type: Number,
        required: true,
    },
    pricePerDay: {
        type: Number,
        required: true,
    },
    category:{
        type: String,
        required: true,
    },
    transmission:{
        type:String,
        required:true,
    },
    FuelType:{
        type: String,
        required: true,
    },
    seatingCapacity:{
        type: Number,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    isAvailable: {
        type: Boolean,
        default: true,
    },
    status:{
        type:String,
        enum:["Pending","Approved","Cancelled"],
        default:"Pending"
    },
    
    description:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        required:true,
    }
    
},{timestamps:true});

module.exports = mongoose.model("Vechical", VechicalSchema);