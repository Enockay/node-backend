import express from 'express';
import { randomString, generateRandomString } from '../public/javascripts/orderNum.js';
import lipaNaMpesaOnline from '../public/javascripts/mpesaProcess.js';
import carryTime from '../public/javascripts/carryTime.js';

const paymentRoute = express.Router();
let time;

paymentRoute.post('/api/makepayment', async (req, res) => {
  try {
    const transactionId = generateRandomString(8);
    // console.log(orderId);
    const { phoneNumber, Amount, timeUnit } = req.body;
    //console.log(req.body);
    console.log("phonenumber",phoneNumber,"amount is",Amount,"timeUnit is ",timeUnit)
    const orderId = transactionId;

    // Ensure allocatedTime is an object with value and unit properties
    const paymentResponse= await lipaNaMpesaOnline(phoneNumber, Amount, orderId);
    // console.log(allocatedTime);
    time = carryTime(timeUnit);

    // Pass relevant data to pushItemsIntoTokenCollection
    //  await pushItemsIntoTokenCollection(phoneNumber, orderId, Amount, allocatedTime);

    res.status(200).json({ success: true, message : paymentResponse});
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to make payment' });
  }
});

export default paymentRoute;
export { time };
