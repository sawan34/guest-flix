/**
* Summary: Comoon Utilities Methods
* @author Sawan Kumar
* @date  12.07.2018
*/
import store from './store';
import {ACTION} from './constants/action.constant';
import { actionGetBoookmarks } from './actions/action.bookmark';
import roomUser from './services/service.roomUser';

import _ from  'lodash';

const COMMON_UTILITIES = {
    isEmpty,
    isEmptyObject,
    getQueryStringValue,
    getCurrencySymbol,
    onImageErrorHandler,
    timeFormat,
    getBookmarksOrderIdByProgramId,
    refreshBookmarks
}


/**
* Description: isEmpty will check the empty value
* @param {string} _param
* @return {boolean}
*/
function isEmpty(_param) {
    return (_param === 'undefined' || _param === undefined || _param === '' || _param === null);
}

/**
* Description: isEmptyObject will check the empty object
* @param {object} _obj
* @return {boolean}
*/
function isEmptyObject(_obj) {
    if (_obj == null) return true;// null and undefined are "empty"
    if (_obj.length > 0) return false;
    if (_obj.length === 0) return true;
    for (var key in _obj) {
        if (hasOwnProperty.call(_obj, key)) return false;
    }
    return true;
}
/**
 * Description:Prepare URL
 * @param {string} key 
 * @return {String} URL
 */
function getQueryStringValue(key) {
    return decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
}
/**
 * Description:Return Currecncy 
 * @return {String} Currency Symbol
 */
function getCurrencySymbol() {
    return "$";
}

/**
 * Description: If image source not available or url is not working
 * @param {e}object
 * @return {none}
 */
function onImageErrorHandler(e) {
    e.target.src = 'images/no-image.png';
}

/**
    * Description: Get Hour and Minute
    * @param {time}string
    * @return {string}
    */
function timeFormat(time) {
    if (isEmpty(time)) {
        return false;
    }
    const HR = time[2] + time[3];
    const MIN = time[5] + time[6];
    return (HR * 1) + 'h ' + (MIN * 1) + 'm';
}

function getBookmarksOrderIdByProgramId(programId){
    let data = false;
    const state = store.getState();
    try{
        if(state.getBookmarks){
            if(state.getBookmarks.data.length > 0){
                 data = getObjectByKeyFromObjectInArray(state.getBookmarks.data,'programId',programId );
                if(data) {
                    return data[0].orderId;
                }
            }
        }
    }catch(e){
        return data;
    }
}

function getObjectByKeyFromObjectInArray(_arrayObj,key,id){
    const data =  _arrayObj.filter((item)=>{
        return _.toNumber(item[key]) === id;
    });
    if(data.length >0){
      return  data;
    }else{
        return false;
    }
}

function refreshBookmarks(){
    const state = store.dispatch(actionGetBoookmarks(roomUser.getStayId()));
}



export default COMMON_UTILITIES;
