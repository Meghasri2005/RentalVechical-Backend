
const express=require("express");
const cors=require("cors");
const app=express();

require("dotenv").config()
const PORT=process.env.PORT||4000;

app.use(cors()); 
app.use(express.json());



const User=require("./routes/UserRouter");
const OwnerRouter=require("./routes/OwnerRouter");
const home=require("./routes/Home")
const Booking=require("./routes/BookingRouter")
const Admin=require("./routes/Admin")


app.use("/api/admin",Admin)
app.use("/api/user",User)
app.use("/api/owner",OwnerRouter)
app.use("/api/home",home)
app.use("/api/Booking",Booking)


const dbConnect=require("./config/Database");
dbConnect();


app.listen(PORT,()=>{
    console.log(`server started successfully at Port ${PORT}`)
})


app.get("/",(req,res)=>{
    res.send(`<h1>this is HomePage of RentalApp</h1>`);
})