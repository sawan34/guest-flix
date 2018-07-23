 /**
* Summary: Contains APIS for VOD Services
* @author Shashi Kapoor Singh
* @date  07.03.2018
*/
import Method from './services';
import API_INTERFACE from '../constants/uri.constant';
import {responseActions} from '../actions/action.response';
import {authHeader} from './service.auth-header';

 const programDetailsServices = {
    getProgramDetails,
  };

/**
    * Description: Make Call to VODS
    * @return {object}
    */
 function getProgramDetails(id){
		return Method.get(API_INTERFACE.ProgramDetails+id,authHeader()).then(
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

export default programDetailsServices;
