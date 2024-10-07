import express from "express";
import cors from "cors";
import generateToken from "../public/javascripts/jwtToken.js";
import { fetchTokens } from "../public/javascripts/ActiveTokens.js";
import {transactions }  from "../public/javascripts/Transaction.js";

const fetchRoute = express.Router();

// GET route for fetching all tokens
fetchRoute.get("/", async (req, res) => {
  try {
    const fetchData = await fetchTokens();
    res.status(200).json(fetchData);
  } catch (error) {
    res.status(400).json({ message: "Error occurred while fetching tokens" });
  }
});

// POST route for generating a new token
fetchRoute.post("/", async (req, res) => {
  const { mac, ip, phone, timeunit, amount } = req.body;
  //console.log(req.body);

  if (!mac || !phone || !timeunit || !amount || !ip) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // Generate the token using the provided data
    const { token, expireTime } = await generateToken(mac, ip, phone, timeunit, amount);
    const TransactionCode = 'PHSA23YUES'
    await transactions(timeunit,amount,phone,TransactionCode);
    res.status(201).json({
      message: "Token generated successfully",
      token,
      expireTime,
    });
  } catch (error) {
    res.status(500).json({ message: "Error generating token", error: error.message });
  }
});

export default fetchRoute;
