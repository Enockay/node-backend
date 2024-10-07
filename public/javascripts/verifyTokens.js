import mongoose from 'mongoose';
import format from 'date-fns/format';

const Token = mongoose.model('Tokens'); // the colllection


const searchItemsInDatabase = async (phoneNumber, orderId) => {
  let statements;
  //console.log(orderId);
  try {
    // Create a query object with the provided parameters
    const query = {};
    const query2 = { orderId };

    const findOrder = await Token.find(query2);

    if (findOrder.length > 0) {
      query.phoneNumber = phoneNumber;

      // Find tokens in the database based on the query
      const tokens = await Token.find(query);

      // Prepare the response

      if (tokens) {
        statements = tokens.map((token) => {
          const currentTime = Date.now();

          // Check if the token is expired
          const isExpired = currentTime > token.expire;

          // Calculate the remaining time
          const timeRemainingInMilliseconds = Math.max(0, token.expire - currentTime);
          const days = Math.floor(timeRemainingInMilliseconds / (1000 * 60 * 60 * 24));
          const hours = Math.floor((timeRemainingInMilliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((timeRemainingInMilliseconds % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((timeRemainingInMilliseconds % (1000 * 60)) / 1000);

          return {
            tokenId: token._id,
            orderId: token.orderId,
            amount: token.amount,
            lastUpdated: format(token.last_updated, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
            expire: format(token.expire, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
            isExpired,
            timeRemaining: {
              days,
              hours,
              minutes,
              seconds,
            },
          };
        });
      }
    } else {
      statements = 'NOT FOUND';
    }

    return statements;
  } catch (error) {
    console.error('Error searching items in the database:', error);
    throw error;
  }
};

export default searchItemsInDatabase;
