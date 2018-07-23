/**
 * Summary: auth header
 * Description: prepare header for all requests
 * @author Sawan Kumar.
 * @date  23.07.2018
 */
import Utility from '../commonUtilities';

/**
* Description: returns header params to the request
* @param {string, string} username, password
* @return {object} Content-Type, charset, Accept, Authorization
*/
function authHeader() {
    let token = JSON.parse(localStorage.getItem('GuestFlixTokenDetails'));
    debugger;
        if(!Utility.isEmptyObject(token)){
            let userdata = token.tokenType + " " + token.accessToken;
            return { 'Content-Type': 'application/json; charset=utf-8', 'Accept': 'application/json', 'Authorization': userdata };
        }
        return false;
    
}

export { authHeader };