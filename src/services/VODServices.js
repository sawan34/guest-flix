 /**
* Summary: Contains APIS for VOD Services
* @author Sawan Kumar
* @date  22.06.2018
*/
import Method from './services';
import API_INTERFACE from '../constants/uri.constant';
import {responseActions} from '../actions/response.actions'

 const vodServices = {
    getVods,
  };

/**
    * Description: Make Call to VODS
    * @return {object}
    */
 function getVods(){
		return Method.get(API_INTERFACE.VOD, "").then(
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

export default vodServices;
