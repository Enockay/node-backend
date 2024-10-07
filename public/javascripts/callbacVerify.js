import { time1 } from './carryTime.js';
import generateToken from './jwtToken.js';
import { transactions } from './Transaction.js';

const handleSafaricomCallback = async (body) => {
    try {
        const { stkCallback } = body.Body;
        //console.log('Processing callback', stkCallback);
        const { ResultCode, CheckoutRequestID, CallbackMetadata,ResultDesc } = stkCallback;
        //console.log('ResultCode', ResultCode, 'CheckoutRequestID', CheckoutRequestID);

        let status = ResultDesc;

        if (ResultCode === 0) {
            // Payment was successful
            const TransactionCode = findValueInMetadata(CallbackMetadata.Item, 'MpesaReceiptNumber');
            const amountPaid = findValueInMetadata(CallbackMetadata.Item, 'Amount');
            const  phoneNumber = findValueInMetadata(CallbackMetadata.Item,'PhoneNumber');
            const allocatedTime = await time1;

            // Log the extracted information for debugging
           // console.log('Order ID:', orderId, 'Amount Paid:', amountPaid, 'Allocated Time:', allocatedTime);
            await transactions(allocatedTime,amountPaid,phoneNumber,TransactionCode);
            const mac = "10.xxx.xxx";
            const ip = "192.100.104"
            await generateToken(mac, ip, phoneNumber, allocatedTime, amountPaid);
            status = 'Payment Successful';
        }

        return { success: ResultCode === 0, data: { checkoutRequestID: CheckoutRequestID, status } };
    } catch (error) {
        console.error("Error occurred in manipulating response", error);
        return { success: false, data: { checkoutRequestID: null, status: 'Error' } };
    }
};

// Utility function to find a value in metadata
const findValueInMetadata = (metadata, name) => {
    const item = metadata.find((item) => item.Name === name);
    return item ? item.Value : null;
};

export { handleSafaricomCallback as callback };
