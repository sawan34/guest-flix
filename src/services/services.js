/**
* Summary: AXIOS
* Description: Contains all AXIOS methods
* @author Sawan Kumar
* @date  13.06.2018
*/
import axios from 'axios';
import { validCodes } from '../constants';
 const baseService = {
    get,
    put,
    post,
    delete: _delete
};
export const methodType = {
    get: "GET",
    put: "PUT",
    post: "POST",
    delete: "DELETE"
};
//===========CRUD Operations=====================//


/**
 * Description: Use AXIOS GET METHOD HET 
 * @param {string} url
 * @param {object} header 
 * @param {object} body
 * @return {promise}
 */
function get(url, header, body) {
    return axios.get(url, { headers: { Authorization: header.Authorization } }).then(handleResponse).catch(error);
}


/**
 * Description: Use AXIOS PUT METHOD HET 
 * @param {string} url
 * @param {object} header 
 * @param {object} body
 * @return {promise}
 */
function put(url, header, body) {
    return axios.put(url, body, { headers: { Authorization: header.Authorization } }).then(handleResponse).catch(error);
}

/**
 * Description: Use AXIOS POST METHOD HET 
 * @param {string} url
 * @param {object} header 
 * @param {object} body
 * @return {promise}
 */
function post(url, header, body) {
    return axios.post(url, body, { headers: { Authorization: header.Authorization } }).then(handleResponse).catch(error);
}

/**
 * Description: Use AXIOS DELETE METHOD HET 
 * @param {string} url
 * @param {object} header 
 * @param {object} body
 * @return {promise}
 */
function _delete(url, header, params) {
    return axios.delete(url, { headers: { Authorization: header.Authorization } }).then(handleResponse).catch(error);
}

/**
 * Description: handle valid response code got after axios 
 * @param {object} response
 * @return {promise || response}
 */
function handleResponse(response) {
    if (!validCodes(response.status)) {
        return Promise.reject(response);
    }
    return response;
}


/**
 * Description: called in for error axios 
 * @param {object} error
 * @return {object}
 */
function error(error) {
    return error;
}

export default baseService;
