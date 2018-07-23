 /**
* Summary: Contains APIS for VOD Services
* @author Sawan Kumar
* @date  3.07.2018
*/
import Method from './services';
import API_INTERFACE from '../constants/uri.constant';
import {responseActions} from '../actions/action.response';
import {authHeader} from './service.auth-header';

const servicesSelect = {
    getSelectables,
  };

  function getSelectables(params,groupId,nextData){
    return Method.get(API_INTERFACE.SELECTABLES+params, authHeader()).then(
        req_response => {
            let getResponse = responseActions.response(req_response);
            if (getResponse) {
                getResponse.groupId = groupId;
                getResponse.nextData = nextData;
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


  export default servicesSelect;

