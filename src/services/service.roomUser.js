/**
* Summary: Contains APIS for Room User Services
* @author Akash Sharma
* @date  24.07.2018
*/
import Method from './services';
import API_INTERFACE from '../constants/uri.constant';
import { responseActions } from '../actions/action.response';
import { commonConstants } from '../constants/common.constants';
const RoomUserServices = {
    roomUserRequest,
    getStayId,
    getRoomUserToken,
    getRoomUserInfoFromStorage
};

/**
    * Description: Make Call to RoomUser Service  API
    * @return {object}
    */
function roomUserRequest(roomId) {
    var url = API_INTERFACE.ROOM_USER+roomId+"/user/";
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
 * Return Room User Object from session Storage
 */
function getRoomUserInfoFromStorage() {
	return JSON.parse(sessionStorage.getItem(commonConstants.GUEST_ROOM_USER_INFO));
}

/**
 * Return StayId Type from session Storage
 */
function getStayId() {
	return getRoomUserInfoFromStorage().stayId;
}


/**
 * Return token of RoomUser from session Storage
 */
function getRoomUserToken() {
	return getRoomUserInfoFromStorage().token;
}

export default RoomUserServices;
