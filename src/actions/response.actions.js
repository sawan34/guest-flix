 /**
* Summary: Handling responses from APIS
* @author Sawan Kumar
* @date  22.06.2018
*/
 import {customErrorConst,validCodes } from '../constants/error.constant';
 import {alertActions} from './alert.action';

 export const responseActions = {
    response,
    errorResponse,
    successResponse
  };

  
 /**
 * Description: Get the type and its message
 * @param {object}  response
 * @return {object}
 */
function response(response, message) {
    try {
  
      if (response.hasOwnProperty("response")) {
        response = response.response;
      }
      if (response) {
        if (validCodes(response["status"])) {
          return successResponse(response);
        }else{
          if (response.hasOwnProperty("status")) {
            return errorResponse(customErrorConst[response["status"]],"");      //respond with custom error code
          }
        }
      } else {
        //Can be decided when we will get call from server
      }
    } catch (e) {
      return errorResponse(customErrorConst.ERROR_DEFAULT);
    }
  }
  
 
  /**
   * Description: Get the error message
   * @param {string}   errorMessage
   * @param {string}   serverMsg
   * @return {object}
   */
  function errorResponse(errorMessage, serverMsg) {
    let errorMsg = errorMessage
      ? errorMessage
      : serverMsg
        ? serverMsg
        : customErrorConst.ERROR_DEFAULT;
    return alertActions.error(errorMsg);
  }
  
  /**
   * Description: Get the success message
   * @param {string}   successMessage
   * @return {object}
   */
  function successResponse(successMessage) {
    return alertActions.success(successMessage);
  }
  