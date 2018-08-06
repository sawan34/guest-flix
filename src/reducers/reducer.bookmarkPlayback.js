/**
* Summary:Contain Save on Exit reducers
* @author Akash Sharma
* @date  30.07.2018
*/
import { ACTION } from '../constants/action.constant';
import { alertConstants } from '../constants/alert.constant';
/**
    * Description: reducer Saving Data on Exit
    * @param {object} state  
    * @param {object} action  
    * @return {object}
    */
   export default function (state = {}, action) {
    switch (action.type) {
        case ACTION.BOOKMARK_PLAYBACK:
            return {
                type:action.payload.type,
                message:{
                    status:action.payload.message.status,
                    data:action.payload.message.data,
                }
            }
        break;   
        default:
        break;
    }
    return state;
}