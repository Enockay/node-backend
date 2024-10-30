import mongoose from 'mongoose';
import format from 'date-fns/format';

const Token = mongoose.model('Tokens');

const checkUserLogin = async (phoneNumber, mac) => {
    try {
        const query = { phoneNumber };
        const query2 = { mac };

        const foundUser = await Token.find(query);
        const foundMac = await Token.find(query2);

        let responseState;
        let remainingTime;
        let TransactionCode;

        if (foundUser.length > 0) {
            responseState = 0;
            // Calculate remaining time
            const expireTime = foundUser[0].expire;
            const currentTime = new Date();
            TransactionCode = foundUser[0].TransactionCode;

            remainingTime = (expireTime - currentTime) / 1000
        } else if (foundUser.length > 0 && foundMac.length === 0) {
            responseState = 1;
        } else {
            responseState = 2;
        }

        return { responseState, remainingTime,TransactionCode };
    } catch (error) {
        console.log("error occurred", error);
        return { responseState: -1, remainingTime: 0 }; // Add a default error code or handle it accordingly
    }
}

export { checkUserLogin };
