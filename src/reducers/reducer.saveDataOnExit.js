/**
* Summary:Contain Save on Exit reducers
* @author Sawan Kumar
* @date  25.06.2018
*/

import {ACTION} from '../constants/action.constant';
/**
    * Description: reducer Saving Data on Exit
    * @param {object} state  
    * @param {object} action  
    * @return {object}
    */
export default function(state = {},action){
    switch(action.type){
        case ACTION.SAVE_PREVIOUS:
            return state = Object.assign(state,{
                [ action.payload.screen]:action.payload
            }); 
        break;
        default:
        break;
    }
    return state;
}