/**
* Summary: export actions 
* Description: All actions can be imported by access this file
* @author Akash Sharma
* @date  04.07.2018
*/
import UIConfigService from '../services/service.UIConfig';
import {ACTION} from '../constants/action.constant';

/**
    * Description: Action to fetch group
    * @return {object}
    */

export default function uiConfigAction(){
    let data = [];
    //Fetch 
    data =  UIConfigService.getUiConfig();
    return {
        type:ACTION.GET_UI_CONFIG,
        payload:data
    }
}
