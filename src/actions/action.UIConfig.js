/**
* Summary: export actions 
* Description: All actions can be imported by access this file
* @author Akash Sharma
* @date  04.07.2018
*/
import UIConfigService from '../services/service.UIConfig';
import {ACTION} from '../constants/action.constant';
import Utility from '../commonUtilities'

/**
    * Description: Action to fetch group
    * @return {object}
    */

export default function uiConfigAction(id){
    let data = [];
    //Fetch 
    if(Utility.isEmpty(id)){
    data =  UIConfigService.getUiConfig();
    }else{
        data =  UIConfigService.getUiConfigByParam(id);
    }
    return {
        type:ACTION.GET_UI_CONFIG,
        payload:data
    }
}
