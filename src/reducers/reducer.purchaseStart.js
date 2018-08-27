/**
* Summary:Contain Purchase Start reducers
* @author Shashi Kapoor Singh
* @date  24.07.2018
*/

import { ACTION } from '../constants/action.constant';
import { alertConstants } from '../constants/alert.constant';
/**
    * Description: reducer Purchase Start
    * @param {object} state  
    * @param {object} action  
    * @return {object}
    */
export default function (state = [], action) {
    let fetchedData = null;
    switch (action.type) {
        case ACTION.PURCHASE_START:
            fetchedData = {
                error: "",
                data: "",
                type: ""
            }
            if (action.payload) {
                fetchedData.type = action.payload.type;
                if (action.payload.type === alertConstants.SUCCESS) {
                    fetchedData.data = action.payload.message.data;
                } else {
                    fetchedData.error = action.payload.message;
                }
            }
            return state = Object.assign({}, fetchedData);

        case ACTION.PURCHASE_PMS:
            fetchedData = {
                error: "",
                data: "",
                type: ""
            }
            if (action.payload) {
                fetchedData.type = action.payload.type;
                if (action.payload.type === alertConstants.SUCCESS) {
                    fetchedData.data = action.payload.message.data;
                } else {
                    fetchedData.error = action.payload.message;
                }
            }
            return state = Object.assign({}, fetchedData);

        case ACTION.PURCHASE_COMPLETE:
            fetchedData = {
                error: "",
                data: "",
                type: ""
            }
            if (action.payload) {
                fetchedData.type = action.payload.type;
                if (action.payload.type === alertConstants.SUCCESS) {
                    fetchedData.data = action.payload.message.data;
                } else {
                    fetchedData.error = action.payload.message;
                }
            }
            return state = Object.assign({}, fetchedData);

        default:
            break;
    }

    return state;
}