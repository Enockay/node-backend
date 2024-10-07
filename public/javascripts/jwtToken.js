import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

const tokenSchema = new mongoose.Schema(
  {
    phoneNumber: {
      type: Number,
      required: true,
    },
    timeStamp: {
      type: Number,
      required: true,
    },
    expire: {
      type: Date,
      required: true,
    },
    mac: {
      type: String,
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    ipAddress: {
      type: String,
      required: false,
    },
    last_updated: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tokenSchema.virtual('formatted_time_remaining').get(function () {
  const days = Math.floor(this.time_remaining / (24 * 60 * 60 * 1000));
  const hours = Math.floor((this.time_remaining % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  const minutes = Math.floor((this.time_remaining % (60 * 60 * 1000)) / (60 * 1000));
  const seconds = Math.floor((this.time_remaining % (60 * 1000)) / 1000);

  return `${days} days ${hours} hrs ${minutes} mins ${seconds} secs`;
});

const Token = mongoose.model('Tokens', tokenSchema);

// Function to generate a JWT token and store it in the database
const generateToken = async (mac, ip, phone, timeunit, amount) => {
  const secretKey = 'aOpJFUXdhe4Nt5i5RAKzbuStAPCLK5joDSqqUlfdtZg=';
  
  const { value, unit } = timeunit;

  let timeInSeconds;

  if (unit === 'day' && amount >= 35 || unit === 'days' && amount >= 35) {
    timeInSeconds = value * 24 * 60 * 60; // Convert days to seconds
  } else if (unit === 'hour' && (amount >= 10 && amount <= 35)) {
    timeInSeconds = value * 60 * 60; // Convert hours to seconds
  } else if (unit === 'min' && amount === 5) {
    timeInSeconds = value * 60; // Convert minutes to seconds
  } else if (unit === 'month' && amount >= 400) {
    timeInSeconds = value * 30 * 24 * 60 * 60; // Convert months to seconds (approx. 30 days)
  } else {
    timeInSeconds = value * 60; // Default to minutes if no matching unit/amount condition is met
  }

  const expireInMilliseconds = timeInSeconds * 1000;
  const expireTime = new Date(Date.now() + expireInMilliseconds);

  const tokenData = {
    phoneNumber: phone,
    timeStamp: Math.floor(Date.now() / 1000),
    expire: expireTime,
    mac: mac,
    ipAddress: ip,
  };

  const token = jwt.sign(tokenData, secretKey, { expiresIn: timeInSeconds });

  // Store token and data in the database
  await storeTokenInDatabase({ ...tokenData, token });

  return { token, expireTime };
};


// Function to store token and data in the database
async function storeTokenInDatabase(tokenData) {
  try {
    const newToken = new Token(tokenData);
    await newToken.save();
    //console.log('Token stored in the database:', newToken);
  } catch (error) {
    console.error('Error storing token in the database:', error);
  }
}

export default generateToken;
export {Token}
