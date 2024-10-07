import mongoose from "mongoose";
const Schema = mongoose.Schema;

// Define the schema for the transaction record
const recordTransactionSchema = new Schema({
    packages: {
        value: { type: Number, required: true },
        unit: { type: String, required: true },
    },
    Amount: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    TransactionCode: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
});

// Create a model for the transaction
const Transaction = mongoose.model('Transaction', recordTransactionSchema);

// Function to record a transaction
const transactions = async (packages, Amount ,phoneNumber, TransactionCode) => {
   try {
       // Corrected validation: the if condition should check if any of the required parameters are missing
       if (!packages || !Amount || !phoneNumber || !TransactionCode) {
           console.log('Some items are missing in the transaction recording');
           return;
       }

       // Create a new transaction record
       const newTransaction = new Transaction({
           packages,
           Amount,
           phoneNumber,
           TransactionCode 
       });

       // Save the record to the database
       await newTransaction.save();
       console.log('Transaction recorded successfully');
   } catch (error) {
       console.log('Error occurred while recording the transaction:', error.message);
   }
};

export { Transaction, transactions };
