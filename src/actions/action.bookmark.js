/**
* Summary: BookMarkActions
* Description: All actions can be imported by access this file
* @author Sawan Kumar
* @date  30.07.2018
*/
import BookMarkService from '../services/service.bookmark';
import {ACTION} from '../constants/action.constant';


/**
  * Description: action for getting bookmarks
  * @param {string} stayId
  *  @return {object}
  */
export function actionGetBoookmarks(stayId) {
    //Fetch 
    const data = BookMarkService.getBookMarks(stayId);
    return {
        type: ACTION.GET_BOOKMARKS,
        payload: data
    }
}
