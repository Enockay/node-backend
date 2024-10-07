import firstTimeUser from "../public/javascripts/firstTime.js";
import express  from "express";

const sessionRoute = express.Router();

sessionRoute.post("/session",async (req,res)=>{
    const { phoneNumber , mac, ip, timeunit } = req.body;
    //console.log(timeunit);
  try{
    const responseState =  await firstTimeUser(phoneNumber, mac, ip, timeunit);
   // console.log(responseState);
    res.status(200).json({ ResultCode: responseState });

  }catch(error){
    console.error(error)
    res.status(400).json({message:"error occured while"})
  }
});

export default sessionRoute;