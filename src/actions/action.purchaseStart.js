/**
* Summary: export actions 
* Description: All actions can be imported by access this file
* @author Shashi Singh
* @date  05.07.2018
*/
import purchaseStart from '../services/service.purchaseStart';
import { ACTION } from '../constants/action.constant';

const purchaseStartCompleteAction = {
    purchaseStartAction,
    pmsPurchaseAction,
    purchaseCompleteAction
};

/**
    * Description: Action to purchase start
	* @param {gfOrderId}  string
	* @param {localTxId}  string	        
    * @return {object}
*/
function purchaseStartAction(programId, stayId) {
    // let data = {
    //     type: "success",
    //     message: {
    //         status: 200,
    //         statusText: "OK",
    //         data: {
    //             'gfOrderId': '32141232'
    //         }
    //     }
    // }

    let data = purchaseStart.postPurchaseStart(programId, stayId);

    return {
        type: ACTION.PURCHASE_START,
        payload: data
    }
}

/**
    * Description: Action to purchase complete
	* @param {room}  string
    * @param {stayId}  string
	* @param {gfOrderId}  string    
    * @return {object}
*/
function pmsPurchaseAction(room, stayId, gfOrderId) {
    // let  data = {
    //     type: "success",
    //     message: {
    //         status: 200,
    //         statusText: "OK",
    //         data: {
    //             'localTxId':'34728930481'                
    //         }
    //     }
    // }
    let data = purchaseStart.postPMSPurchase(room, stayId, gfOrderId);
    return {
        type: ACTION.PURCHASE_COMPLETE,
        payload: data
    }
}

/**
    * Description: Action to purchase complete
	* @param {gfOrderId}  string
	* @param {localTxId}  string	    
    * @return {object}
*/
function purchaseCompleteAction(gfOrderId, localTxId) {
    //let data = {
    //     type: "success",
    //     message: {
    //         status: 200,
    //         statusText: "OK",
    //         data: {
    //             'exp': 'NewTexId7878',
    //             'playbackMeta': { 'drm': 'playready', 'url': 'url' }
    //         }
    //     }
    // }
    let data = purchaseStart.putPurchaseComplete(gfOrderId, localTxId);
    return {
        type: ACTION.PURCHASE_COMPLETE,
        payload: data
    }
}

export default purchaseStartCompleteAction;
