/**
* Summary: Contains APIS for Auth Services
* @author Akash Sharma
* @date  04.07.2018
*/
import Method from './services';
import API_INTERFACE from '../constants/uri.constant';
import { responseActions } from '../actions/action.response';
import { commonConstants } from '../constants/common.constants';
import { alertConstants } from '../constants/alert.constant';
import { Md5 } from 'ts-md5/dist/md5';
const AuthenticationServices = {
	getTokenRequest,
	getTokenFromStorage,
	getAccessToken,
	getTokenType,
	getRefreshToken,
	getsiteId,
	getRoomId,
	getAuthTokenRequest,
};

/**
    * Description: Make Call to AUTH Service to get Token API
    * @return {object}
    */
function getTokenRequest(query) {
	var url = API_INTERFACE.AUTH + query;
	return Method.get(url, "").then(
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
 * Return Auth Object from Local Storage
 */
function getTokenFromStorage() {
	return JSON.parse(localStorage.getItem(commonConstants.AUTH_TOKEN_STORAGE));
}

/**
 * Return Token Type from Local Storage
 */
function getTokenType() {
	return getTokenFromStorage().tokenType;
}

/**
 * Return Access Token  from Local Storage
 */
function getAccessToken() {
	return getTokenFromStorage().accessToken;
}

/**
 * Return Refresh Token  from Local Storage
 */
function getRefreshToken() {
	return getTokenFromStorage().refreshToken;
}

/**
 * Return Site Id  from Local Storage
 */
function getsiteId() {
	return getTokenFromStorage().siteId;
}

/**
 * Return Room Id  from Local Storage
 */
function getRoomId() {
	return getTokenFromStorage().room;
}

/**
 * Return MD5 key  combination of SiteId and RoomId
 * @param {*} siteId 
 * @param {*} roomId 
 */
function getkey(siteId, roomId) {
	var key = Md5.hashStr(siteId + roomId + "");
	return key;
}

/**
 * Request the AUTH Service to get the AUTH API and store in Local Storage in String format
 * @param {*} siteId 
 * @param {*} roomId 
 */
function getAuthTokenRequest(siteId, roomId) {
	const queryParameter = "?siteId=" + siteId + "&room=" + roomId + "&key=" + getkey(siteId, roomId);
	getTokenRequest(queryParameter).then((response) => {
		if (response.type === alertConstants.SUCCESS)
			this.setTokenToStorage(JSON.stringify(response.message.data[0]))
	})
}

export default AuthenticationServices;
