import express from 'express';
import { callback } from '../public/javascripts/callbacVerify.js';
import { notifyClient } from '../bin/www.js'; // Adjust the path as necessary

const safaricomRoute = express.Router();

safaricomRoute.post('/api/callback', async (req, res) => {
    try {
        console.log('Received callback request:', req.body);

        const result = await callback(req.body);

        const { checkoutRequestID, status,Code } = result.data;
        notifyClient(checkoutRequestID, status,Code);

        res.status(200).json({ success: true, message: "Received callback from Safaricom" });
    } catch (error) {
        console.error('Error handling callback:', error);
        res.status(500).json({ success: false, message: "Failed to handle callback" });
    }
});

export default safaricomRoute;
