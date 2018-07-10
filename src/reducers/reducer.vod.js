/**
* Summary:Contain Vod reducers
* @author Sawan Kumar
* @date  25.06.2018
*/

import { ACTION } from '../constants/action.constant';
/**
    * Description: reducer Vod
    * @param {object} state  
    * @param {object} action  
    * @return {object}
    */
export default function (state = [], action) {
    switch (action.type) {
        case ACTION.VOD:
            if (action.payload === "cached") {
                return state;
            }
            const fecthedData = {
                error: "",
                data: "",
                type: ""
            }
            if (action.payload) {
                fecthedData.type = action.payload.type;
                if (action.payload.type === "success") {
                    fecthedData.data = action.payload.message.data;
                } else {
                    fecthedData.data = action.payload.message;
                }
            }
            return state = Object.assign({}, fecthedData);
            break;
            default:
            break;
    }

    return state;
}