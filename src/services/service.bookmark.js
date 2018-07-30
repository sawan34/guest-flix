/**
* Summary: Update the playback position 
* @author Akash Kumar Sharma
* @date  30.07.2018
*/
import Method from './services';
import API_INTERFACE from '../constants/uri.constant';
import {responseActions} from '../actions/action.response';
import {authHeader} from './service.auth-header';

const bookmarkServices = {
    getBookMarks    
  };
/**
 * Description: Make Call to Grouping API
 */  
function getBookMarks(stayId){
    return Method.get(API_INTERFACE.GET_BOOKMARKS+"?stayId="+stayId,authHeader()).then(
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
export default bookmarkServices;



