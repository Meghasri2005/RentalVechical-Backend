const User=require("../models/UserModel")
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");

const Login=async (req,res)=>{

   try{
         const {email,password}=req.body;

        // verifing the inputs
            if(!email||!password)
            {
                return res.json({
                    success:false,
                    message:"email,password are required"
            })
        }
        //is existed or not
        const existingUser=await User.findOne({email});
            if(!existingUser){
                return res.status(400).json({
                    success:false,
                    message:"Invalid credentials"});
            }

        // verifying the password
        const isPasswordCorrect=await bcrypt.compare(password,existingUser.password);
        if(!isPasswordCorrect){
            return res.status(400).json({
                success:false,
                message:"Invalid credentials"});
        }

        const token=jwt.sign({id:existingUser._id},process.env.JWT_SECRET,{expiresIn:"1d"});
            res.status(200).json({
                success:true,
                message:"Login successful",
                token,
                user:{
                    name:existingUser.name,
                    email:existingUser.email
                }
            })

    }
    catch(err){
        console.log(err);
        res.status(500).json({
            success:false,
            message:"Server Error"})
    } 


}

const getData=async(req,res)=>{
    try{
        const user=req.user;
        res.status(200).json({
            success:true,
            message:"Data retrieved successfully",
            user
        });
    }
    catch(err){
        console.log(err);
        res.status(500).json({message:"Server Error"})
    }
}

module.exports={Login,getData};
