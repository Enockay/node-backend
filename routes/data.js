// Define your schema
import moment from 'moment'
import  express  from 'express';
const app = express.Router();
import   { Transaction } from '../public/javascripts/Transaction.js'

// Generate the timestamps
const generateTimestamps = () => {
    const startDate = moment('2024-02-01');
    const endDate = moment('2024-04-26');
    const totalDays = endDate.diff(startDate, 'days') + 1;
    const totalItems = 773;
    const timestamps = [];

    // Generate timestamps evenly across the days
    for (let i = 0; i < totalDays; i++) {
        const currentDate = startDate.clone().add(i, 'days');
        const itemsForDay = Math.floor(totalItems / totalDays); // Distribute items across days
        const extraItems = Math.min(8, totalItems - timestamps.length); // Adjust to match the desired daily item count

        for (let j = 0; j < extraItems; j++) {
            const randomTime = currentDate.clone().add({
                hours: Math.floor(Math.random() * 24),
                minutes: Math.floor(Math.random() * 60),
                seconds: Math.floor(Math.random() * 60),
            });
            timestamps.push(randomTime.toDate());
        }
    }

    // Sort and adjust the array to fit exactly 773 items
    timestamps.sort((a, b) => a - b);
    return timestamps.slice(0, totalItems);
};

// Route to update timestamps
app.put('/', async (req, res) => {
    try {
        const timestamps = generateTimestamps();
        const transactions = await Transaction.find(); // Get all documents

        for (let i = 0; i < transactions.length; i++) {
            if (i < timestamps.length) {
                transactions[i].created_at = timestamps[i];
                await transactions[i].save();
            }
        }

        res.status(200).json({ message: 'Timestamps updated successfully!' });
    } catch (error) {
        console.error('Error updating documents:', error);
        res.status(500).json({ error: 'Failed to update timestamps.' });
    }
});

app.get('/income', async (req, res) => {
  try {
    // Fetch all transactions
    const transactions = await Transaction.find({});

    // Analyze the data: Group by month, sum the income, and count unique clients
    const incomeData = transactions.reduce((acc, transaction) => {
      // Format the date to get the month (e.g., "Feb 2024")
      const month = moment(transaction.created_at).format('MMM YYYY');

      // Check if the month already exists in the accumulator
      if (!acc[month]) {
        acc[month] = { totalIncome: 0, clients: new Set() };
      }

      // Sum the Amount for that month, converting to a number if necessary
      acc[month].totalIncome += Number(transaction.Amount) || 0;
      // Add the phone number to the set of unique clients
      acc[month].clients.add(transaction.phoneNumber);

      return acc;
    }, {});

    // Convert the data into the desired format
    const formattedIncomeData = Object.entries(incomeData).map(([month, data]) => ({
      month,
      income: data.totalIncome,
      numberOfClients: data.clients.size, // Number of unique clients
    }));

    res.json(formattedIncomeData);
  } catch (error) {
    console.error('Error fetching or analyzing income data:', error);
    res.status(500).send('Server Error');
  }
});

app.put('/remove-packages', async (req, res) => {
  try {
    // Temporarily allow modification of schema-required fields
    await Transaction.updateMany(
      { packages: { $exists: true } }, // Find transactions with a packages field
      { $unset: { packages: "" } },    // Remove the packages field
      { strict: false }                // Bypass schema validation for this update
    );

    console.log('Packages field removed from all transactions.');
    res.status(200).json({ message: 'Packages field removed successfully from all transactions' });
  } catch (error) {
    console.error('Error removing packages field:', error);
    res.status(500).json({ message: 'An error occurred while removing the packages field', error });
  }
});

app.put('/update-packages', async (req, res) => {
  try {
    // Normalize Amount values to a standard format (convert to string)
    const normalizeAmount = (amount) => String(amount).trim().toLowerCase();

    // Fetch all transactions with Amount field and without packages field
    const transactions = await Transaction.find({ Amount: { $exists: true, $ne: null }, packages: { $exists: false } });

    const bulkUpdates = transactions.map((transaction) => {
      const normalizedAmount = normalizeAmount(transaction.Amount);
      let packageValue = null;
      let packageUnit = null;

      // Determine the package value and unit based on normalized Amount
      if (normalizedAmount === "5") {
        packageValue = 30;
        packageUnit = 'min';
      } else if (normalizedAmount === "10") {
        packageValue = 1;
        packageUnit = 'hour';
      } else if (normalizedAmount >= "25" && normalizedAmount <= "30") {
        packageValue = 1;
        packageUnit = 'day';
      } else if (normalizedAmount >= "170" && normalizedAmount <= "200") {
        packageValue = 1;
        packageUnit = 'week';
      } else if (normalizedAmount >= "220" && normalizedAmount <= "250") {
        packageValue = 2;
        packageUnit = 'weeks';
      } else if (normalizedAmount >= "300" && normalizedAmount <= "450") {
        packageValue = 1;
        packageUnit = 'month';
      }

      // If valid package data is found, create a bulk update operation
      if (packageValue !== null && packageUnit !== null) {
        return {
          updateOne: {
            filter: { _id: transaction._id },
            update: { $set: { packages: { value: packageValue, unit: packageUnit } } }
          }
        };
      }
    }).filter(Boolean); // Filter out null or undefined values

    if (bulkUpdates.length > 0) {
      await Transaction.bulkWrite(bulkUpdates);
      console.log(`${bulkUpdates.length} transactions updated successfully.`);
      res.status(200).json({ message: `${bulkUpdates.length} transactions updated successfully.` });
    } else {
      res.status(200).json({ message: 'No matching transactions to update.' });
    }
  } catch (error) {
    console.error('Error updating packages:', error);
    res.status(500).json({ message: 'An error occurred while updating packages', error });
  }
});

app.get('/fetch', async (req, res) => {
  try {
    // Fetch all transactions from the database
    const data = await Transaction.find({});

    // Return the fetched data in the response
    res.status(200).json(data);
  } catch (error) {
    // Log the error and send a 500 Internal Server Error response
    console.error('Error fetching data:', error);
    res.status(500).json({ message: 'Internal Server Error', error });
  }
});

app.get('/transaction',async(req,res)=>{
  try{
   const { phoneNumber} = req.query;
   console.log(phoneNumber)
   if(!phoneNumber){
    return res.status(400).json('query is missing');
   }
   const response = await Transaction.find({phoneNumber});
   if(response.length > 0){
    res.status(200).json(response)
   }else{
    res.status(404).json("No transaction found under that number")
   }

  }catch(error){
    console.log("error occured while fetching item",error);
    res.status(500).json('Internal Server error')
  }
})



export default app