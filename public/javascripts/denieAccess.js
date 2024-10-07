import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { removeUserFromInternet } from './RouterOsconfg.js';

const Token = mongoose.model('Tokens');

const checkTokenExpiry = async () => {
  try {
    // Retrieve all tokens from the database
    const allTokens = await Token.find({}, 'token');

    allTokens.forEach(async (token) => {
      try {
        const decodedToken = jwt.verify(token.token, 'aOpJFUXdhe4Nt5i5RAKzbuStAPCLK5joDSqqUlfdtZg=');
      } catch (err) {
        // Handle any verification errors
       // console.error(`Error verifying token ${token._id}:`, err);
        //removeUserFromInternet(token.mac);
        await Token.deleteOne({ _id: token._id });
      }
    });
  } catch (error) {
    console.error('Error retrieving tokens from the database:', error);
  }
};

export { checkTokenExpiry };
