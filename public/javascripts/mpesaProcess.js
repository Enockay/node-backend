import axios from "axios";
import moment from "moment";

const consumerKey = 'YPxsS3S68mQLxEaTAzH1PbG6qt03dYXi';
const consumerSecretKey = 'UdkVoWW4oqCqgmQI';
const lipaNaMpesaOnlineShortCode = '6696654';
const lipaNaMpesaOnlinePassKey = '4b55ed5145cd2f614dbdf71743f5c5f84ca6574a824f1b7291f5e4b8983941e0';
const lipaNaMpesaOnlineCallBackUrl = 'https://node-blackie-networks.fly.dev/api/callback';
const Party2B = '4086382';

async function getAccessToken() {
  const url = "https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";
  const auth = "Basic " + Buffer.from(`${consumerKey}:${consumerSecretKey}`).toString("base64");

  try {
    const response = await axios.get(url, {
      headers: { Authorization: auth },
    });
    return response.data.access_token;
  } catch (error) {
    console.error("Error fetching access token:", error.message);
    throw new Error("Failed to retrieve access token.");
  }
}

async function lipaNaMpesaOnline(phoneNumber, amount, orderID) {
  try {
    // Format phone number
    if (phoneNumber.startsWith("0")) {
      phoneNumber = "254" + phoneNumber.slice(1);
    }

    // Get access token
    const accessToken = await getAccessToken();
    const authHeader = `Bearer ${accessToken}`;

    // Prepare STK push data
    const timestamp = moment().format("YYYYMMDDHHmmss");
    const password = Buffer.from(
      `${lipaNaMpesaOnlineShortCode}${lipaNaMpesaOnlinePassKey}${timestamp}`
    ).toString("base64");

    const requestData = {
      BusinessShortCode: lipaNaMpesaOnlineShortCode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerBuyGoodsOnline",
      Amount: amount,
      PartyA: phoneNumber,
      PartyB: Party2B,
      PhoneNumber: phoneNumber,
      CallBackURL: lipaNaMpesaOnlineCallBackUrl,
      AccountReference: orderID,
      TransactionDesc: "Payment for order " + orderID,
    };

    // Send STK push request
    const url = "https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest";
    const response = await axios.post(url, requestData, {
      headers: { Authorization: authHeader },
    });

    return response.data;
  } catch (error) {
    console.error("STK Push failed:", error.message);
    return {
      success: false,
      message: "Request failed.",
      error: error.message,
    };
  }
}


export default lipaNaMpesaOnline;