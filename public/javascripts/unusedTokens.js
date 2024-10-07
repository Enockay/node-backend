import { purchases } from "./firstTime.js";

const queryItems = async (req, res) => {
    try {
        const query = {};
        const items = await purchases.find(query);
        res.status(200).json(items)
    } catch (error) {
        res.status(400).json(`encounterd an error while quering ${error}`);
    }

}


const deleteItems = async (req, res) => {
    const phoneNumber = req.params.id;
    const queryId = { phoneNumber };

    try {

        const findId = await purchases.find(queryId);

        if (findId.length > 0) {
            let deletedItem = await purchases.deleteOne(queryId);
            res.status(200).json(`item with phoneNumber:${phoneNumber} successfully deleted`)
        } else {
            res.status(200).json(`${phoneNumber} not found in the database`);
        }
    } catch (error) {
        res.status(400).json(`An error occured while deleting items: ${error}`);

    }
}

export default queryItems;
export { deleteItems }