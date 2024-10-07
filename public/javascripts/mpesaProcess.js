import fetch from 'node-fetch';
import generateToken from './jwtToken.js';

let isRequestInProgress = false;

const consumerKey = 'YPxsS3S68mQLxEaTAzH1PbG6qt03dYXi';
const consumerSecretKey = 'UdkVoWW4oqCqgmQI';
const lipaNaMpesaOnlineShortCode = '6696654';
const lipaNaMpesaOnlinePassKey = '4b55ed5145cd2f614dbdf71743f5c5f84ca6574a824f1b7291f5e4b8983941e0';
const lipaNaMpesaOnlineCallBackUrl = 'https://node-blackie-networks.fly.dev/api/callback';
const Party2B = '4086382';

async function getToken() {
  const url = 'https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';
  const auth = Buffer.from(`${consumerKey}:${consumerSecretKey}`).toString('base64');

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Basic ${auth}`,
    },
  });

  const data = await response.json();

  if (!data.access_token) {
    throw new Error('Failed to access Token');
  }

  return data.access_token;
}

async function lipaNaMpesaOnline(phoneNumber, amount, orderId) {
  if (isRequestInProgress) {
    throw new Error('Another request is already in progress');
  }

  isRequestInProgress = true;

  try {
    const accessToken = await getToken();
    const timestamp = generateTimestamp();

    const url = 'https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest';
    const password = Buffer.from(`${lipaNaMpesaOnlineShortCode}${lipaNaMpesaOnlinePassKey}${timestamp}`).toString('base64');

    const payLoad = {
      BusinessShortCode: lipaNaMpesaOnlineShortCode,
      Timestamp: timestamp,
      Password: password,
      TransactionType: 'CustomerBuyGoodsOnline',
      Amount: amount,
      PartyA: phoneNumber,
      PartyB: Party2B,
      PhoneNumber: phoneNumber,
      CallBackURL: lipaNaMpesaOnlineCallBackUrl,
      AccountReference: orderId,
      TransactionDesc: 'Payment for your order',
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payLoad),
    });

    const data = await response.json();

    return data;
  } finally {
    isRequestInProgress = false;
  }
}

function generateTimestamp() {
  const now = new Date();
  const year = now.getFullYear();
  const month = (`0${now.getMonth() + 1}`).slice(-2);
  const day = (`0${now.getDate()}`).slice(-2);
  const hours = (`0${now.getHours()}`).slice(-2);
  const minutes = (`0${now.getMinutes()}`).slice(-2);
  const seconds = (`0${now.getSeconds()}`).slice(-2);

  return `${year}${month}${day}${hours}${minutes}${seconds}`;
}

export default lipaNaMpesaOnline;