/**
* Summary: export actions 
* Description: All actions can be imported by access this file
* @author Sawan Kumar
* @date  21.06.2018
*/
import VODSERVICE from '../services/VODServices';
import {ACTION} from '../constants/action.constant';
import SELECTABLES from '../services/services.selectables'
import ProgramDetailsServices from '../services/ProgramDetailsServices';

/**
    * Description: Action to fetch group
    * @return {object}
    */

export function fetchGroupings(){
    let data = [];
    //Fetch 
    data =  VODSERVICE.getVods();;
    return {
        type:ACTION.VOD,
        payload:data
    }
}

/**
    * Description: Get Program Details
    * @return {object}
    */

   export function getProgramDetails(id){
    let data = [];
    //Fetch 
    data =  ProgramDetailsServices.getProgramDetails(id);;
    return {
        type:ACTION.ProgramDetails,
        payload:data
    }
}

/**
    * Description: action for getting selectables
    *  @return {object}
    */
export function actionGetSelectables(params,groupId=""){
    let data = [];
    let queryString = "";
    if(params.length > 0){
        queryString = '?id=' + params.join('&id=');
    }
    //Fetch 
    data =  SELECTABLES.getSelectables(queryString,groupId);;
    return {
        type:ACTION.GET_SELECTABLES,
        payload:data
    }
}
   /* * Description: action for saving data of back Screen  while moving forward
    * @param {string} stateData  
    * @return {object}
    */

export function saveStateOnExitScreen(stateData){
    return {
        type:ACTION.SAVE_PREVIOUS,
        payload:stateData
    }
}