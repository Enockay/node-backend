import mongoose from "mongoose";
import { Transaction } from "../public/javascripts/Transaction.js";
import express from "express";

async function getUniquePhoneNumbers() {
    try {
        // Aggregation to retrieve unique phone numbers and add '+' prefix
        const uniquePhoneNumbers = await Transaction.aggregate([
            { $group: { _id: "$phoneNumber" } },  // Group by phoneNumber to get unique entries
            { $project: { phoneNumber: { $concat: ["+", { $toString: "$_id" }] } } },  // Convert to string and add '+' prefix
        ]);

        console.log("Unique Phone Numbers with Prefix:", uniquePhoneNumbers);
        return uniquePhoneNumbers.map(entry => entry.phoneNumber);

    } catch (error) {
        console.error("Error retrieving phone numbers:", error);
    } finally {
        mongoose.connection.close(); // Close the connection after use
    }
}

const router = express.Router();

router.get('/', async (req, res) => {
    const phoneNumber = await getUniquePhoneNumbers();
    res.status(200).json({ "phoneNumber": phoneNumber });
});

export default router;
