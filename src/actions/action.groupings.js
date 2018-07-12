/**
* Summary: export actions 
* Description: All actions can be imported by access this file
* @author Akash Sharma
* @date  05.07.2018
*/
import GroupingService from '../services/service.groupings';
import {ACTION} from '../constants/action.constant';

/**
    * Description: Action to fetch group
    * @return {object}
    */

export default function groupingAction(){
    let data = [];
    //Fetch 
    data =  GroupingService.getGrouping();
    return {
        type:ACTION.GET_GROUPINGS,
        payload:data
    }
}
