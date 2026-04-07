const fs = require("fs");
const imagekit = require("../config/ImageKit");

const Vechical=require("../models/Vechicals")
const User=require("../models/UserModel")
const jwt=require("jsonwebtoken")

require("dotenv").config()

const RoleChange=async(req,res)=>{

    try{
        const {_id}=req.user;

        const user=await User.findById(_id)
        if(!user)
        {
            return res.status(401).json({
                success:false,
                message:"You need to login"
            })
        }

        const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        { role: "Owner" },
        { returnDocument: "after" }
        );

        return res.json({
            success:true,
            message:"you can now addVehicals now",
            updatedUser
        })
    }
    catch(err){
        console.log(err);
        
        res.status(500).json({
            success:false,
            message:"Server Error"})
    }
}

const addVechical=async(req,res)=>{
    try{
        const {id}=req.user;
        const VechicalData=JSON.parse(req.body.VechicalData);
        console.log(VechicalData);
        const imageFile=req.file;
        // upload image to imagekit


        if (!imageFile){
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
        const data=await Vechical.create({...VechicalData,owner:id,image})

        res.json({
            success:true,
            message:`Vechical successfully added`,
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

const allOwnerVechicals=async(req,res)=>{
    try{
        const {id}=req.user;
    if(!id)
    {
        return res.json({
            success:false,
            message:"you are not owner"
        })
    }

    const OwnerVechicals=await Vechical.find({owner:id});
    console.log(OwnerVechicals)
    if(!OwnerVechicals)
    {
        return res.json({
            success:false,
            message:"you have not added the vechicals",
        })
    }

    return res.json({
        success:true,
        message:"owner vechicals are fetched",
        OwnerVechicals

    })
    }
    catch(err)
    {
        return res.json({
            success:false,
            message:"error in server"
        })
    }
}

const getAllOwnerCars=async(req,res)=>{
    try{
        const {id}=req.user;
    if(!id)
    {
        return res.json({
            success:false,
            message:"you are not owner"
        })
    }

    const allOwnerCars=await Vechical.find({owner:id,vechicalType:'Car'});
    if(!allOwnerCars)
    {
        return res.json({
            success:false,
            message:"you have not added cars",
        })
    }

    return res.json({
        success:true,
        message:"owner vechicals are fetched",
        allOwnerCars

    })
    }
    catch(err)
    {
        return res.json({
            success:false,
            message:"error in server"
        })
    }
}

const getAllOwnerBikes=async(req,res)=>{
    try{
        const {id}=req.user;
    if(!id)
    {
        return res.json({
            success:false,
            message:"you are not owner"
        })
    }

    const allOwnerBikes=await Vechical.find({owner:id,vechicalType:'Bike'});
    if(!allOwnerBikes)
    {
        return res.json({
            success:false,
            message:"you have not added cars",
        })
    }

    return res.json({
        success:true,
        message:"owner vechicals are fetched",
        allOwnerBikes

    })
    }
    catch(err)
    {
        return res.json({
            success:false,
            message:"error in server"
        })
    }
}

const getAllOwnerAuto=async(req,res)=>{
    try{
        const {id}=req.user;
    if(!id)
    {
        return res.json({
            success:false,
            message:"you are not owner"
        })
    }

    const allOwnerAutos=await Vechical.find({owner:id,vechicalType:'Auto'});
    if(!allOwnerAutos)
    {
        return res.json({
            success:false,
            message:"you have not added cars",
        })
    }

    return res.json({
        success:true,
        message:"owner vechicals are fetched",
        allOwnerAutos

    })
    }
    catch(err)
    {
        return res.json({
            success:false,
            message:"error in server"
        })
    }
}

const getAllOwnerScooters=async(req,res)=>{
    try{
        const {id}=req.user;
    if(!id)
    {
        return res.json({
            success:false,
            message:"you are not owner"
        })
    }

    const allOwnerScooters=await Vechical.find({owner:id,vechicalType:'Scooter'});
    if(!allOwnerScooters)
    {
        return res.json({
            success:false,
            message:"you have not added cars",
        })
    }

    return res.json({
        success:true,
        message:"owner vechicals are fetched",
        allOwnerScooters

    })
    }
    catch(err)
    {
        return res.json({
            success:false,
            message:"error in server"
        })
    }
}

const getallvechicals=async (req,res)=>{
    try{
        const vechicals=await Vechical.find({isAvailable:true,status:'Approved'});
        if(!vechicals)
        {
            return res.json({
                success:false,
                message:"vechicals are not availiable"
            })
        }
         return res.json({
                success:true,
                message:"vechicals are fetched",
                vechicals

        })
        
    }
    catch(err)
    {
        console.log(err.message);
         return res.json({
                success:false,
                message:"vechicals are not availiable"
            })
    }

}

const getallcars=async (req,res)=>{
    try{
        const vechicals=await Vechical.find({isAvailable:true,vechicalType:"Car",status:'Approved'});
        if(!vechicals)
        {
            return res.json({
                success:false,
                message:"vechicals are not availiable"
            })
        }
         return res.json({
                success:true,
                message:"vechicals are fetched",
                vechicals

        })
        
    }
    catch(err)
    {
        console.log(err.message);
         return res.json({
                success:false,
                message:"vechicals are not availiable"
            })
    }

}

const getallbikes=async (req,res)=>{
    try{
        const vechicals=await Vechical.find({isAvailable:true,vechicalType:"Bike",status:'Approved'});
        if(!vechicals)
        {
            return res.json({
                success:false,
                message:"vechicals are not availiable"
            })
        }
         return res.json({
                success:true,
                message:"vechicals are fetched",
                vechicals

        })
        
    }
    catch(err)
    {
        console.log(err.message);
         return res.json({
                success:false,
                message:"vechicals are not availiable"
            })
    }

}

const getallautos=async (req,res)=>{
    try{
        const vechicals=await Vechical.find({isAvailable:true,vechicalType:"Auto",status:'Approved'});
        if(!vechicals)
        {
            return res.json({
                success:false,
                message:"vechicals are not availiable"
            })
        }
         return res.json({
                success:true,
                message:"vechicals are fetched",
                vechicals

        })
        
    }
    catch(err)
    {
        console.log(err.message);
         return res.json({
                success:false,
                message:"vechicals are not availiable"
            })
    }

}

const getallscooters=async (req,res)=>{
    try{
        const vechicals=await Vechical.find({isAvailable:true,vechicalType:"Scooter",status:'Approved'});
        if(!vechicals)
        {
            return res.json({
                success:false,
                message:"vechicals are not availiable"
            })
        }
         return res.json({
                success:true,
                message:"vechicals are fetched",
                vechicals

        })
        
    }
    catch(err)
    {
        console.log(err.message);
         return res.json({
                success:false,
                message:"vechicals are not availiable"
            })
    }

}

const getalllocations=async (req,res)=>{
    try{
        const locations = await Vechical.distinct("location", {
      status: "Approved"
            })
         return res.json({
                success:true,
                message:"locations are fetched",
                locations

        })
        
    }
    catch(err)
    {
        console.log(err.message);
         return res.json({
                success:false,
                message:"vechicals are not availiable"
            })
    }

}

const toggleAvailability=async (req,res)=>{
    try{
        const id=req.params.id

        const vech=await Vechical.findById(id)
        if(!vech)
        {
            return res.json({
                success:false,
                message:"car id needed"
            })
        }

        const updatedVechical = await Vechical.findByIdAndUpdate(
        id,
        {$set:{isAvailable:!vech.isAvailable}},
        { returnDocument: "after" }
        );

        return res.json({
            success:true,
            message:"you have changed the status",
            updatedVechical
        })
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            success:false,
            message:"Server Error"})
    }

}

const deleteVechical=async(req,res)=>{
    try{
        const id=req.params.id
        if(!id){
            return res.json({
                success:false,
                message:"car id required"

            })}
        
        await Vechical.findByIdAndDelete(id,{"owner":" "},{new:true});
        return res.json({
            success:true,
            message:"Ower deleted the Car"
        })   
    }
    catch(err){
        console.log(err);
        return res.status(500).json({message:"Server Error"})
    }
}

const getVechical=async(req,res)=>{
    try{
        const id=req.params.id
        if(!id){
            return res.json({
                success:false,
                message:"Vechical id required"

            })}
        
        const Vech=await Vechical.findById(id)
        if(!id){
            return res.json({
                success:false,
                message:"Vechical is not there"

            })}
        return res.json({
            success:true,
            message:"Vechical is fetched",
            Vech
        })   
    }
    catch(err){
        console.log(err);
        return res.status(500).json({success:false,message:"Server Error"})
    }
}


module.exports={RoleChange,addVechical,allOwnerVechicals,getAllOwnerCars,getAllOwnerBikes,getAllOwnerAuto,getAllOwnerScooters,getallvechicals,toggleAvailability,deleteVechical,getVechical,getallcars,getallbikes,getallautos,getallscooters,getalllocations};
