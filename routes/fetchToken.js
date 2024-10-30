import express from "express";
import cors from "cors";
import generateToken from "../public/javascripts/jwtToken.js";
import { fetchTokens, updateToken, deleteToken } from "../public/javascripts/ActiveTokens.js";
import { transactions } from "../public/javascripts/Transaction.js";
import { Transaction } from "../public/javascripts/Transaction.js";

const fetchRoute = express.Router();

// GET route for fetching all tokens
fetchRoute.get("/", async (req, res) => {
  try {
    const fetchData = await fetchTokens();
    res.status(200).json(fetchData);
  } catch (error) {
    console.error("Error fetching tokens:", error.message);
    res.status(400).json({ message: "Error occurred while fetching tokens" });
  }
});

// POST route for generating a new token
fetchRoute.post("/", async (req, res) => {
  const { mac, ip, phone, timeunit, amount } = req.body;

  if (!mac || !phone || !timeunit || !amount || !ip) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    
    const RandomTransactionCode = (length) =>{
      const Character = "ABCDEFGHIJKLMNOPQRSTVWXYZ01234567890";

      let TranactionCode = "";

      for(let i = 0; i < length; i++){
        const RandomIndex = Math.floor(Math.random()*Character.length);
        TranactionCode+=Character[RandomIndex]
      }

      return TranactionCode
    }
    const TransactionCode = RandomTransactionCode(10);
    
    // Generate the token using the provided data
    const { token, expireTime } = await generateToken(mac, ip, phone, timeunit, amount,TransactionCode);
      
    // Log the transaction
    await transactions(timeunit, amount, phone, TransactionCode);

    res.status(201).json({
      message: "Token generated successfully",
      token,
      expireTime,
    });
  } catch (error) {
    console.error("Error generating token:", error.message);
    res.status(500).json({ message: "Error generating token", error: error.message });
  }
});

// PATCH route for updating an existing token
fetchRoute.patch("/:id", async (req, res) => {
  const tokenId = req.params.id;
  console.log(tokenId)
  const { phone, mac, ip, expiresAt } = req.body;

  if (!phone || !mac || !ip || !expiresAt) {
    return res.status(400).json({ message: "Missing required fields for update" });
  }

  try {
    const updatedToken = await updateToken(tokenId, { phone, mac, ip, expiresAt });
    res.status(200).json({
      message: "Token updated successfully",
      token: updatedToken,
    });
  } catch (error) {
    console.error("Error updating token:", error.message);
    res.status(500).json({ message: "Error updating token", error: error.message });
  }
});

// DELETE route for deleting a token
fetchRoute.delete("/:id", async (req, res) => {
  const tokenId = req.params.id;

  try {
    await deleteToken(tokenId);
    res.status(200).json({ message: "Token deleted successfully" });
  } catch (error) {
    console.error("Error deleting token:", error.message);
    res.status(500).json({ message: "Error deleting token", error: error.message });
  }
});

//get user phoneNumber 
fetchRoute.get("/phone",async(req,res)=>{
  try{

    const phoneNumber = req.query.number;

    const searchNumber = async (phone) => {

      const firstTwo = phone.slice(0,2);
      const lastTwo =  phone.slice(-3);

      const pattern = new RegExp(`^${firstTwo}\\d+${lastTwo}`);
      
      const phoneNumber = await Transaction.find({ phoneNumber: { $regex : pattern}});
      if(phoneNumber.length >0){
        return phoneNumber
      }
    }

    const matchedNumber = await searchNumber(phoneNumber);
    res.status(200).json({ success:true , phone :matchedNumber});

  }catch(error){
    res.status(504).json("error while retriving Numbers")
  }
})

export default fetchRoute;
