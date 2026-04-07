const mongoose=require("mongoose");

const UserSchema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    phoneNumber:{
        type:Number,
        required:true,
        trim:true,
        minlength: 10,
        maxlength: 10
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:["Owner","User","Admin"],
        default:"User"
    },
    isBlocked: { type: Boolean, default: false },
    image:{
        type:String,
        default:""
    }


},{timestamps:true})

module.exports=mongoose.model("User",UserSchema)