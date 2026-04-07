const mongoose=require("mongoose");
require("dotenv").config();

const dbConnect= () =>{
    mongoose.connect(process.env.DATABASE_URL)
    .then(()=>{
        console.log("DataBase is succesfully conntected")
    })
    .catch((error)=>{
        console.log("error in connection is",error)
        process.exit(1);
    })
}

module.exports=dbConnect;