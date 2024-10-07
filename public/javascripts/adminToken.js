import jwt from 'jsonwebtoken';
import { Token } from './jwtToken.js';

const generateToken = async (phoneNumber, macAddress, ipAddress, expiryTime) => {
    try {
        const secretKey = 'aOpJFUXdhe4Nt5i5RAKzbuStAPCLK5joDSqqUlfdtZg=';

        // Parse expiry time value and unit
        const [value, unit] = expiryTime.split(' ');
        const expireInMilliseconds = calculateExpirationMilliseconds(value, unit);

        const expireTime = new Date(Date.now() + expireInMilliseconds);

        const tokenData = {
            phoneNumber,
            macAddress,
            ipAddress,
            expire: expireTime,
            mac: '00:01:0F:0H:6D', // Include mac here
            timeStamp: Math.floor(Date.now() / 1000) // Include timeStamp here
        };

        const token = jwt.sign(tokenData, secretKey, { expiresIn: expireInMilliseconds / 1000 });

        await storeTokenInDatabase(tokenData, token);

        return { token, expireTime };
    } catch (error) {
        console.error('Error generating token:', error);
        throw new Error('Error generating token');
    }
};

async function storeTokenInDatabase(tokenData, token) {
    try {
        const newToken = new Token({ ...tokenData, token });
        await newToken.save();
        //console.log('Token stored in the database:', newToken);
    } catch (error) {
        console.error('Error storing token in the database:', error);
        throw new Error('Error storing token in the database');
    }
}

function calculateExpirationMilliseconds(value, unit) {
    switch (unit) {
        case 'hours':
            return parseInt(value) * 60 * 60 * 1000; // Convert hours to milliseconds
        case 'minutes':
            return parseInt(value) * 60 * 1000; // Convert minutes to milliseconds
        case 'days':
            return parseInt(value) * 24 * 60 * 60 * 1000; // Convert days to milliseconds
        default:
            throw new Error('Invalid time unit');
    }
}

export default generateToken;
