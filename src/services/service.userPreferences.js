/**
* Summary: Update the playback position 
* @author Sawan Kumar
* @date  30.07.2018
*/
import Method from './services';
import API_INTERFACE from '../constants/uri.constant';
import {responseActions} from '../actions/action.response';
import {authHeader} from './service.auth-header';

const preferenceServices = {
    getUserPreferences,
    saveUserPreferences    
  };
/**
 * Description: Make Call to get User preferences
 * @param{string} stayId
 * @return {Object}
 */  
function getUserPreferences(stayId){
    return Method.get(API_INTERFACE.USER_PREFERENCES+"/"+stayId,authHeader()).then(
        req_response => {
            let getResponse = responseActions.response(req_response);
            if (getResponse) {
                return getResponse;
            }
        },
        error => {
            return responseActions.errorResponse(error);
        }
    ).catch(function (error) {
        console.log(error);
      });
}

/**
 * Description: Make Call to save User preferences
 * @param {string} stayId
 * @param {Object} data
 * @return {Object}
 */  
function saveUserPreferences(stayId,data){
    return Method.put(API_INTERFACE.USER_PREFERENCES+"/"+stayId,authHeader(),data).then(
        req_response => {
            let getResponse = responseActions.response(req_response);
            if (getResponse) {
                return getResponse;
            }
        },
        error => {
            return responseActions.errorResponse(error);
        }
    ).catch(function (error) {
        console.log(error);
      });
}
export default preferenceServices;



