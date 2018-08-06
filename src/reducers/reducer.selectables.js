/**
* Summary:Contain Selectable reducers
* @author Sawan Kumar
* @date  03.07.2018
*/

import { ACTION } from '../constants/action.constant';
import { alertConstants } from '../constants/alert.constant';

/**
    * Description: reducer Vod
    * @param {object} state  
    * @param {object} action  
    * @return {object}
    */
export default function (state = [], action) {
    switch (action.type) {
        
        case ACTION.REFRESH_SELECTABLE:
        return state = [];
        break;
        case ACTION.GET_SELECTABLES:
            if (action.payload === "cached") {
                return state;
            }
            const fecthedData = {};
            if (action.payload) {
                fecthedData.type = action.payload.type;
                if (action.payload.type ===alertConstants.SUCCESS) {
                    fecthedData.data = [];
                    for(let i=0;i<action.payload.message.data.length;i++){
                        fecthedData.data[i] = {
                            adult: action.payload.message.data[i].adult,
                            advisories: action.payload.message.data[i].advisories,
                            availableAudio: action.payload.message.data[i].availableAudio,
                            availableSubtitles: action.payload.message.data[i].availableSubtitles,
                            descriptionLang:action.payload.message.data[i].descriptionLang,
                            entityType:action.payload.message.data[i].entityType,
                            genres:action.payload.message.data[i].genres,
                            id:action.payload.message.data[i].id,
                            images:action.payload.message.data[i].images,
                            price:action.payload.message.data[i].price,
                            programId:action.payload.message.data[i].programId,
                            qualityRating:action.payload.message.data[i].qualityRating,
                            rating:action.payload.message.data[i].rating,
                            releaseDate:action.payload.message.data[i].releaseDate,
                            releaseYear:action.payload.message.data[i].releaseYear,
                            runTime:action.payload.message.data[i].runTime,
                            shortDescription:action.payload.message.data[i].shortDescription,
                            title:action.payload.message.data[i].title,
                            titleLang:action.payload.message.data[i].titleLang,
                            topCast:action.payload.message.data[i].topCast,
                            type:action.payload.message.data[i].type,
                        }
                    } // loop ends
                    fecthedData.type = alertConstants.SUCCESS;
                    fecthedData.groupId = action.payload.groupId;
                } else {
                    fecthedData.data = action.payload.message;
                }
            }
            if(action.payload.nextData){
                return state = fecthedData;
            }else{
                    return state = state.concat(fecthedData);                
            }
            break;
            default:
            break;
    }

    return state;
}