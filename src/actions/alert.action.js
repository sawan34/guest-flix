/**
* Summary: alert messages
* Description: Methods contains here are used to add type to API calls
* @author Sawan Kumar
* @date  21.06.2018
*/
import { alertConstants } from '../constants/alert.constant';

export const alertActions = {
    success,
    error,
    clear
};

/**
    * Description: call success call
    * @param {string} message  
    * @return {object}
    */
function success(message) {
    return { type: alertConstants.SUCCESS, message };
}

/**
    * Description: call success call
    * @param {string} message  
    * @return {object}
    */
function error(message) {
    return { type: alertConstants.ERROR, message };
}
/**
    * Description: call success clear
    * @return {object}
    */
function clear() {
    return { type: alertConstants.CLEAR };
}