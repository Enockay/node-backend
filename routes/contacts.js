import express from 'express';
import { Transaction } from '../public/javascripts/Transaction.js'; // Adjust the path to your schema file
import XLSX from 'xlsx';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const fiveDaysAgo = new Date();
    fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

    // Fetch unique phone numbers
    const clients = await Transaction.aggregate([
      {
        $match: {
          phoneNumber: { $regex: /^254/, $options: 'i' },
          created_at: { $gte: fiveDaysAgo },
        },
      },
      { $group: { _id: '$phoneNumber' } },
      { $project: { phoneNumber: '$_id', _id: 0 } },
    ]);

    if (!clients.length) {
      return res.status(404).json({ error: 'No clients found for the specified criteria.' });
    }

    // Prepare data for Excel
    const data = clients.map(client => ({ PhoneNumber: `+${client.phoneNumber}` }));

    // Create a new workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);

    // Append the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Contacts');

    // Generate Excel file buffer
    const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    // Set headers and send the file
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="contacts.xlsx"');
    res.status(200).send(excelBuffer);
  } catch (error) {
    console.error('Error exporting XLS:', error);
    res.status(500).json({ error: 'Failed to export XLS.', details: error.message });
  }
});

export default router;
