 /**
* Summary: Contains Object for all URI
* @author Sawan Kumar
* @date  22.06.2018
*/

const urlConstants = {
    BASE_URL: window.BASE_URL
};

const API_INTERFACE = {
    AUTH : urlConstants.BASE_URL+"auth/key",
    UI_CONFIG : urlConstants.BASE_URL+"uiConfig/", 
    GROUPINGS : urlConstants.BASE_URL+"groupings/",
    SELECTABLES:urlConstants.BASE_URL+"selectables/", 
    ProgramDetails: urlConstants.BASE_URL+"programs/"
}
export default API_INTERFACE;