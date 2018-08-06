/**
* Summary:Contain Bookmark reducers
* @author Sawan Kumar
* @date  02.08.2018
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
        case ACTION.GET_USER_PREFERENCES:
        case ACTION.SAVE_USER_PREFERENCES:
        
        const fecthedData = {};
        if (action.payload) {
            fecthedData.type = action.payload.type;
            if (action.payload.type ===alertConstants.SUCCESS) {
                fecthedData.data =  {
                    stayId: action.payload.message.data.stayId,
                    uiLanguage: action.payload.message.data.preferences.uiLanguage,
                    programFilters: action.payload.message.data.preferences.programFilters
                };
                fecthedData.type = alertConstants.SUCCESS;
                return state = fecthedData;
            }else{
                fecthedData.data = action.payload.message;                
            }
        }else {
            fecthedData.data = action.payload.message;
        } 
        default:
            break;
    }
    return state;
}