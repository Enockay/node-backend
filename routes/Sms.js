import express from 'express';
import { Transaction } from '../public/javascripts/Transaction.js'
const router = express.Router();

router.post('/', async (req, res) => {
  const startTime = new Date();

  try {
    const { message, recipients } = req.body;

    // Validate message
    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message text is required.' });
    }

    let clients = [];

    if (recipients && recipients.length > 0) {
      // Validate provided recipients
      clients = recipients.map(phone => ({ _id: phone.startsWith('+') ? phone : `+${phone}` }));
    } else {
      // Date range for transactions (last 5 days)
      const fiveDaysAgo = new Date();
      fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

      // Fetch unique phone numbers starting with "254" from transactions
      clients = await Transaction.aggregate([
        {
          $match: {
            phoneNumber: { $regex: /^254/, $options: 'i' },
            created_at: { $gte: fiveDaysAgo },
          },
        },
        {
          $group: { _id: '$phoneNumber' },
        },
        {
          $addFields: {
            _id: { $concat: ['+', '$_id'] },
          },
        },
      ]);
    }

    if (!clients.length) {
      return res.status(404).json({ error: 'No clients found for the specified criteria.' });
    }

    // Prepare messages for Infobip
    const messages = clients.map(client => ({
      destinations: [{ to: client._id }],
      from: SENDER_ID,
      text: message,
    }));

    const postData = JSON.stringify({ messages });

    // Send SMS via Infobip
    const infobipPromise = new Promise((resolve, reject) => {
      const options = {
        method: 'POST',
        hostname: INFOBIP_HOSTNAME,
        path: '/sms/2/text/advanced',
        headers: {
          Authorization: `App ${INFOBIP_API_KEY}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        maxRedirects: 20,
      };

      const infobipReq = https.request(options, response => {
        const chunks = [];

        response.on('data', chunk => {
          chunks.push(chunk);
        });

        response.on('end', () => {
          const body = Buffer.concat(chunks).toString();
          const parsedBody = JSON.parse(body);
          console.log('Infobip response:', parsedBody);
          resolve(parsedBody);
        });

        response.on('error', error => {
          console.error('Error sending SMS:', error);
          reject(error);
        });
      });

      infobipReq.write(postData);
      infobipReq.end();
    });

    const infobipResponse = await infobipPromise;
    const endTime = new Date();

    res.status(200).json({
      message: 'SMS sent successfully.',
      clients,
      messages: infobipResponse.messages || [],
      startTime,
      endTime,
      count: clients.length,
    });
  } catch (error) {
    console.error('Error sending SMS:', error);
    res.status(500).json({ error: 'Failed to send SMS.', details: error.message });
  }
});

export default router;
