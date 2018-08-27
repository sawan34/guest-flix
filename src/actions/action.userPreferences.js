/**
* Summary: export actions 
* Description: All actions can be imported by access this file
* @author Akash Sharma
* @date  04.07.2018
*/
import userPreferenceService from '../services/service.userPreferences';
import {ACTION} from '../constants/action.constant';

/**
 * Description: Action to get User preferences
 * @param{string} stayId
 * @return {Object}
 */  

export function actionGetUserPreferences(stayId){
    //Fetch 
    var data =  userPreferenceService.getUserPreferences(stayId);
    return {
        type:ACTION.GET_USER_PREFERENCES,
        payload:data
    }
}

/**
 * Description: Action to save User preferences
 * @param {string} stayId
 * @param {Object} data
 * @return {Object}
 */
export function actionSaveUserPreferences(stayId,data){
    //Fetch 
    var dataFetch =  userPreferenceService.saveUserPreferences(stayId,data);
    return {
        type:ACTION.SAVE_USER_PREFERENCES,
        payload:dataFetch
    }
}  