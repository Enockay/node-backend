import express from 'express';
import { checkUserLogin } from '../public/javascripts/userLoginVerify.js';

const disconnect = express.Router();

disconnect.post('/', async (req, res) => {
    try {
        const { phoneNumber, MpesaCode } = req.body;

        if (!phoneNumber || !MpesaCode) {
            return res.status(400).json({ success: false, message: 'Phone number and Mpesa code are required.' });
        }

        console.log(`Phone Number: ${phoneNumber}, Mpesa Code: ${MpesaCode}`);

        const { responseState, remainingTime, TransactionCode } = await checkUserLogin(phoneNumber, MpesaCode);

        if (responseState === 0) {
            if (TransactionCode === MpesaCode) {
                return res.json({ success: true, remainingTime });
            } else {
                return res.status(410).json({ success: false, message: 'Invalid Transaction Code.' });
            }
        } else {
            return res.status(305).json({ success: false, message: 'This account has no active package.' });
        }
    } catch (error) {
        console.error('Error in disconnect route:', error);
        res.status(500).json({ success: false, message: 'Failed to verify user.' });
    }
});

export default disconnect;
