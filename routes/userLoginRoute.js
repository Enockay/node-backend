// Import necessary modules and models
import express from 'express';
import { checkUserLogin } from '../public/javascripts/userLoginVerify.js';
import firstTimeUser from '../public/javascripts/firstTime.js';

const userLoginRoute = express.Router();

userLoginRoute.post('/login/Api', async (req, res) => {

  try {
    const {phoneNumber, mac, ip} = req.body;
     
    const responseState = await firstTimeUser(phoneNumber,mac,ip);

    res.json({ success: true, responseState });
  } catch (error) {
    res.json({ success: false, error });
  }
});

export { userLoginRoute };
