import mongoose from 'mongoose';
import searchItemsInDatabase from './verifyTokens.js';

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://myAtlasDBUser:Enockay23@myatlasclusteredu.bfx6ekr.mongodb.net/Blackie-Networks');
    
    console.log('connected to Blackie-Networks database successfully');
    // pushItemsIntoTokenCollection();
  } catch (error) {
    console.error('error in connecting to mongoDB', error.message);
    process.exit(1);
  }
};

searchItemsInDatabase(null, 5);

export { connectDB };
