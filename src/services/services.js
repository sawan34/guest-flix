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

//Get Call
function get(url, header, body) {
    return axios.get(url, { headers: { Authorization: header.Authorization } }).then(handleResponse).catch(error);
}

//create Call
function put(url, header, body) {
    return axios.put(url, body, { headers: { Authorization: header.Authorization } }).then(handleResponse).catch(error);
}
//update Call
function post(url, header, body) {
    return axios.post(url, body, { headers: { Authorization: header.Authorization } }).then(handleResponse).catch(error);
}

// Delete Call (prefixed function name with underscore because delete is a reserved word in javascript)
function _delete(url, header, params) {
    return axios.delete(url, { headers: { Authorization: header.Authorization } }).then(handleResponse).catch(error);
}

//callback of response (returns promise)
function handleResponse(response) {
    if (!validCodes(response.status)) {
        return Promise.reject(response);
    }
    return response;
}

//callback of error
function error(error) {
    return error;
}

export default baseService;
