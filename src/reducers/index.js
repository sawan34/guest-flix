/**
* Summary:Contain root reducers
* Description:Contain all reducers
* @author Sawan Kumar
* @date  25.06.2018
*/
import { combineReducers } from 'redux';
import ReducerVod from './reducer.vod.js';
import getScreenStateData from './reducer.saveDataOnExit';
import getGroupings from './reducer.groupings';
import getSelectables from './reducer.selectables';
import getUiConfig from './reducer.UIConfig'
import reducerProgramDetails from './reducer.programDetails';
/**
    * Description: Combining reducer
    */
const rootReducer = combineReducers({
  VOD:ReducerVod,
  getScreenStateData:getScreenStateData,
  getSelectables:getSelectables,
  getGroupings : getGroupings,
  getUiConfig : getUiConfig,
  getProgramDetails:reducerProgramDetails
});

export default rootReducer;