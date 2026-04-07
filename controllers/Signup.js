const bcrypt=require("bcrypt");
const json=require("jsonwebtoken");
const User=require("../models/UserModel")

const fs = require("fs");
const imagekit = require("../config/ImageKit");

const Signup=async(req,res)=>{
    try{
        const {name,email,password,phoneNumber}=req.body;
        if(!name || !email || !password ||!phoneNumber){
            return res.status(400).json({
                success:false,
                message:"All fields are required"});
        }

        const existingUser=await User.findOne({email});
        if(existingUser){
            return res.status(409).json({
                success:false,
                message:"User already exists"});
        }
        const hashedPassword=await bcrypt.hash(password,10);

        const newUser=await User.create(
            {   name,
                email,
                phoneNumber,
                password:hashedPassword
            });

        const token=json.sign({id:newUser._id},process.env.JWT_SECRET,{expiresIn:"1d"});

        res.status(200).json({
            success:true,
            message:"User created successfully",
            token,
            user:{
                name:newUser.name,
                email:newUser.email
            }});



    }
    catch(err){
        console.log(err);
        res.status(500).json({
            success:false,
            message:"Server Error"})
    }
    
}

const uploadImage=async(req,res)=>{
    
    try{

        const {id}=req.user;
        const imageFile=req.file;
            // upload image to imagekit
    
    
            if (!imageFile) {
                return res.status(400).json({
                    success: false,
                    message: "Image file is required"
                });
            }
    
    
            const response=await imagekit.files.upload({
                file: fs.createReadStream(imageFile.path),
                fileName: Date.now() + "-" + imageFile.originalname,
                folder: "/Vechicals"
            })
    
            
            // for url generation ,works for both images and videos
            var optimizedimageURL=imagekit.helper.buildSrc({
                src:response.url,
                urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
                transformation:[
                    {width:1280,//width resizing
                    quality:80,//auto conpression
                    format:'webp',//convert to mordern formate
                    }
                ]
            });
            
    
            const image=optimizedimageURL;
            console.log(image)
            const data=await User.findByIdAndUpdate(id,{image:image},{})
    
            res.json({
                success:true,
                message:'car added',
                data
    
            })
    
            }
    catch(err)
    {
            console.log(err.message);
            res.status(500).json({
                    success:false,
                    message:err.message
            })
     }
}
    


module.exports={Signup,uploadImage};