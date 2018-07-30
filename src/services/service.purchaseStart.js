 /**
* Summary: Contains Purchase Start Services
* @author Shashi Kapoor Singh
* @date  24.07.2018
*/
import Method from './services';
import API_INTERFACE from '../constants/uri.constant';
import {responseActions} from '../actions/action.response';
import {authHeader} from './service.auth-header';

//TODO: rename below const to purchaseStartCompleteServices
 const purchaseStartCompleteServices = {
	postPurchaseStart,
	postPMSPurchase,
	putPurchaseComplete,
  };

/**
	* Description: Make Call to Purchase Start
	* @param {programId}  string
	* @param {siteId}  string	
    * @return {object}
*/
 function postPurchaseStart(programId, stayId){
		return Method.post(API_INTERFACE.PurchaseStart, authHeader() , {programId:programId, stayId:stayId}).then(
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
	* Description: Make Call to PMS Purchase 
	* @param {room}  string
    * @param {stayId}  string
	* @param {gfOrderId}  string   
    * @return {object}
*/ 
function postPMSPurchase(room, stayId, gfOrderId){
	return Method.post(API_INTERFACE.ROOM_USER + room+"/user/"+stayId+"/purchase", authHeader(),  {gfOrderId:gfOrderId}).then(
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
	* Description: Make Call to Purchase Complete
	* @param {gfOrderId}  string
	* @param {localTxId}  string	
    * @return {object}
*/ 
 function putPurchaseComplete(gfOrderId, localTxId){
	return Method.put(API_INTERFACE.PurchaseCompelte+"/"+gfOrderId, authHeader(),  {localTxId:localTxId}).then(
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

export default purchaseStartCompleteServices;
