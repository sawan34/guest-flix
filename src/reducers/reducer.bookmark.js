/**
* Summary:Contain Save on Exit reducers
* @author Sawan Kumar
* @date  30.07.2018
*/
import { ACTION } from '../constants/action.constant';
import { alertConstants } from '../constants/alert.constant';
/**
    * Description: reducer Saving Data on Exit
    * @param {object} state  
    * @param {object} action  
    * @return {object}
    */
export default function (state = {}, action) {
    switch (action.type) {
        case ACTION.BOOKMARK_PLAYBACK:
            return {
                type:action.payload.type,
                message:{
                    status:action.payload.message.status,
                    data:action.payload.message.data,
                }
            }
        break;   
        case ACTION.GET_BOOKMARKS:
        const fecthedData = {};
        if (action.payload) {
            fecthedData.type = action.payload.type;
            if (action.payload.type ===alertConstants.SUCCESS) {
                fecthedData.data = [];
                for(let i=0;i<action.payload.message.data.length;i++){ //restructing data
                    fecthedData.data[i] = {
                        expireTime: action.payload.message.data[i].exp,
                        orderId: action.payload.message.data[i].gfOrderId,
                        playbackMeta: action.payload.message.data[i].playbackMeta,
                        positionInMs: action.payload.message.data[i].positionMs,
                        programId:action.payload.message.data[i].programId,
                        roomId:action.payload.message.data[i].room,
                        siteId:action.payload.message.data[i].siteId,
                        stayId:action.payload.message.data[i].stayId
                    }
                } // loop ends
                fecthedData.type = alertConstants.SUCCESS;
            }
        }else {
            fecthedData.data = action.payload.message;
        }   
        return state = fecthedData;
        break;
        default:
        break;
    }
    return state;
}