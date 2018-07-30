/**
 * Summary: auth header
 * Description: prepare header for all requests
 * @author Sawan Kumar.
 * @date  23.07.2018
 */
import Utility from '../commonUtilities';
import AuthenticationServices from  './service.authentication';

/**
* Description: returns header params to the request
* @param {string, string} username, password
* @return {object} Content-Type, charset, Accept, Authorization
*/
function authHeader() {
        if(!Utility.isEmptyObject(AuthenticationServices.getTokenType()) && !Utility.isEmptyObject(AuthenticationServices.getAccessToken())){
            let userdata = AuthenticationServices.getTokenType() + " " + AuthenticationServices.getAccessToken();
            return { 'Content-Type': 'application/json; charset=utf-8', 'Accept': 'application/json', 'Authorization': userdata };
        }
        return false;
    
}

export { authHeader };