import { Token } from "./jwtToken.js";

// Fetch all tokens
const fetchTokens = async () => {
    try {
        const items = await Token.find({});
        return items;
    } catch (error) {
        console.error("Error fetching tokens:", error);
        return [];
    }
};

const updateToken = async (tokenId, updatedFields) => {
    try {
      // Debugging
      //console.log("Token ID:", tokenId);
      //console.log("Updated Fields:", updatedFields);
  
      // Validate tokenId and updatedFields
      if (!tokenId || typeof tokenId !== 'string') {
        throw new Error("Invalid token ID provided");
      }
  
      if (!updatedFields || typeof updatedFields !== 'object' || Object.keys(updatedFields).length === 0) {
        throw new Error("No fields provided to update");
      }
  
      // Find the token by ID and update it with new data
      const updatedToken = await Token.findByIdAndUpdate(
        tokenId,
        { $set: updatedFields }, // Explicitly use $set for updating fields
        { new: true, runValidators: true } // Use runValidators to validate the update
      );
  
      if (!updatedToken) {
        throw new Error(`Token with ID ${tokenId} not found`);
      }
  
      // Log successful update
      //console.log("Token successfully updated:", updatedToken);
  
      return updatedToken;
    } catch (error) {
      console.error(`Error updating token with ID ${tokenId}:`, error);
      throw new Error("Failed to update token");
    }
  };
  

// Delete token by ID
const deleteToken = async (tokenId) => {
    try {
        const deletedToken = await Token.findByIdAndDelete(tokenId);
        if (!deletedToken) {
            throw new Error(`Token with ID ${tokenId} not found`);
        }
        return deletedToken;
    } catch (error) {
        console.error(`Error deleting token with ID ${tokenId}:`, error);
        throw new Error("Failed to delete token");
    }
};

export { fetchTokens, updateToken, deleteToken };
