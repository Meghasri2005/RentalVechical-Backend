const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");
require("dotenv").config();

const Protect= async (req, res, next) => {
  const authHeader = req.headers.authorization;

  console.log("HEADERS:", authHeader);
   if (!authHeader) {
    return res.status(401).json({ message: "You need to be a user" });
  }

  if (!authHeader||!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token missing" });
  }
    const token = authHeader.split(" ")[1].replace(/"/g, "");
    console.log("TOKEN:", token);

  try {
    
    const decode=jwt.verify(token, process.env.JWT_SECRET);
    
    if(!decode){
        return res.status(401).json({ message: "Invalid token" });
        
    }
    
    // ✅ Attach user info
    req.user = await User.findById(decode.id).select("-password");     // IMPORTANT
    console.log("USER:", req.user);

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports={Protect} ;