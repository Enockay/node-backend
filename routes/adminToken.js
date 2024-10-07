// backend/routes/tokenRoutes.js
import express from 'express';
import generateToken from '../public/javascripts/adminToken.js';

const adminToken = express.Router();

// Route for generating a token
adminToken.post("/generateToken", async (req, res) => {
    const { phoneNumber, macAddress, ipAddress, expiryTime } = req.body;
   // console.log(req.body);
    try {
        const { token, expireTime } = await generateToken(phoneNumber, macAddress, ipAddress, expiryTime);
        res.status(200).json({ token, expireTime });
    } catch (error) {
        console.error('Error generating token:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default adminToken;
