import express from "express";
import sendWhatsAppMessage from "../public/javascripts/Whatsapp.js";

const router = express.Router();

router.get('/',async(req, res)=>{
    const feedback = await sendWhatsAppMessage('+254748590146', 'Premium Plan', '30 days', '2024-10-01 12:00 PM');
    res.status(200).json(feedback)
    
});

export default  router