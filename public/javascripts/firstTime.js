import mongoose from "mongoose";
import generateToken from "./jwtToken.js";

const puchaseSchema = mongoose.Schema({
  Amount: {
    type: Number,
    required: true,
  },
  TransactionId: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: Number,
    required: true,
  }
});

const purchases = mongoose.model('purchases', puchaseSchema);

const firstTimeUser = async (phoneNumber, mac, ip, timeunit) => {
  let responseState;
  try {
    const query = { phoneNumber };

    const querryData = await purchases.find(query);
    //console.log("data in the databas",querryData);

    if (querryData.length > 0) {
      const amount1 = querryData[0].Amount;
      try {

        const token = await generateToken(mac, ip, phoneNumber, timeunit, amount1);
        // Delete the item
        const deleteResult = await purchases.deleteOne(query);

        if (deleteResult.deletedCount > 0 && token) {
          // console.log('Item successfully deleted.');
          responseState = 0;

        } else {
          console.log('Item deletion failed.');
          responseState = 1;
        }

      } catch (error) {
        console.log("error in producing token", error)
      }

    } else {
      console.log('User not found.');
      responseState = 2;
    }
    return responseState;

  } catch (error) {
    console.error('Error in firstTimeUser:', error);
    return { success: false, error: 'An error occurred.' };
  }
};

export { purchases }
export default firstTimeUser;
