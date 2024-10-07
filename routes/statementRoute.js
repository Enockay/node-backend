import express from 'express';
import searchItemsInDatabase from '../public/javascripts/verifyTokens.js';

const statementRoute = express.Router();

statementRoute.post('/api/getStatements', async (req, res) => {
  try {
    const { phoneNumber, Order_Id } = await req.body;
    // console.log(req.body);

    // Call the logic function to search items in the database
    const statements = await searchItemsInDatabase(phoneNumber, Order_Id);

    res.json({ success: true, statements });
  } catch (error) {
    console.error('Error getting statements:', error);
    res.status(500).json({ success: false, error: 'Error getting statements' });
  }
});

export default statementRoute;
