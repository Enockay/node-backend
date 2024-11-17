import express from 'express';
import generateToken from '../public/javascripts/jwtToken.js';
import { checkUserLogin } from '../public/javascripts/userLoginVerify.js';

const jwt = express.Router();

jwt.post('/api/jwt', async (req, res) => {
    try {
        const phone_number = req.body.phoneNumber;
        const mac = req.body.mac;
        console.log(mac , phone_number);

        const {responseState, remainingTime,TransactionCode } = await checkUserLogin(phone_number, mac);

        res.json({ success: true, ResultCode: responseState, RemainingTime: remainingTime,TransactionCode:TransactionCode });

    } catch (error) {
        console.error(error);

        res.status(500).json({ success: false, error: 'Failed to generate token for user' });
    }
});

export default jwt;
