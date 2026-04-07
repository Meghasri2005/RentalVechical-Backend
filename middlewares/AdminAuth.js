


const adminAuth = (req,res,next)=>{
   if(req.user.role !== "Admin"){
      return res.status(403).json({
         success:false,
         message:"Access Denied"
      })
   }
   next()
}
module.exports={adminAuth} ;