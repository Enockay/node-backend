import express from 'express';

const router = express.Router();

// Route to create a new token
router.post('/tokens', async (req, res) => {
  try {
    const newToken = new Token({
      OrderId: req.body.OrderId,
      amount: req.body.amount,
      timeStamp: req.body.timeStamp,
      expire: req.body.expire,
    });

    const savedToken = await newToken.save();
    res.json(savedToken);
  } catch (error) {
    console.error('Error creating token:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/* router.post('/api/callback', async (req, res) => {
    try {
      // Extract relevant information from the M-Pesa response in req.body
      const { amount, OrderId, timeStamp } = req.body;

      // Save the relevant information to the database (Token model)
      const newToken = new Token({
        OrderId,
        amount,
        timeStamp
      });

      const savedToken = await newToken.save();

      res.json(savedToken);
      console.log(savedToken);

    } catch (error) {
      console.error('Error handling M-Pesa response:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

*/
export default router;
