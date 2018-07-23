 /**
* Summary: Contains APIS for Grouping Services
* @author Akash Sharma
* @date  05.07.2018
*/
import Method from './services';
import API_INTERFACE from '../constants/uri.constant';
import {responseActions} from '../actions/action.response';
import {authHeader} from './service.auth-header';

 const groupingServices = {
    getGrouping,
  };

/**
    * Description: Make Call to Grouping API
    * @return {object}
    */
 function getGrouping(){
		return Method.get(API_INTERFACE.GROUPINGS,authHeader()).then(
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

export default groupingServices;
