import { Token } from "./jwtToken.js";

const fetchTokens = async () => {
    try{
     const query = {};
     const items = await Token.find({})
     //console.log(items);
     return items;
     
    }catch(error){
        console.log("error in fetching tokens",error);
        return []
    }
}

export {fetchTokens};
