 /**
* Summary: Contains APIS for UI Config Services
* @author Akash Sharma
* @date  04.07.2018
*/
import Method from './services';
import API_INTERFACE from '../constants/uri.constant';
import {responseActions} from '../actions/response.actions'

 const uiCongigServices = {
    getUiConfig,
  };

/**
    * Description: Make Call to UiConfig
    * @return {object}
    */
 function getUiConfig(){
		return Method.get(API_INTERFACE.UI_CONFIG, "").then(
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

export default uiCongigServices;
