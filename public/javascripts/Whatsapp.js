import twilio from "twilio";

const accountSid = 'AC1496ac80c4e42a2df78f372b924f0341'; // Your Twilio Account SID
const authToken = '728165262c57dc590234678e90263299'; // Your Twilio Auth Token
const client = new twilio(accountSid, authToken);

const sendWhatsAppMessage = async (phoneNumber, packageName, validityPeriod, expiryTime) => {
  const message = `Thanks for trusting Blackie Networks. You have purchased the ${packageName} package valid for ${validityPeriod}. The expiry time is ${expiryTime}. If you experience any connection issues, feel free to text back.`;

  await client.messages
    .create({
      body: message,
      from: 'whatsapp:+254796869402', // Your WhatsApp-enabled Twilio number
      to: `whatsapp:${phoneNumber}`   // User's phone number
    })
    .then(message => console.log(`Message sent: ${message.sid}`))
    .catch(error => console.error(`Error sending message: ${error}`));
};

export default sendWhatsAppMessage
