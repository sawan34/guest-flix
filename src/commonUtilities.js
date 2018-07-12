/**
* Summary: Comoon Utilities Methods
* @author Sawan Kumar
* @date  12.07.2018
*/

const COMMON_UTILITIES = {
    isEmpty,
    isEmptyObject
}


/**
* Description: isEmpty will check the empty value
* @param {string} _param
* @return {boolean}
*/
function isEmpty(_param) {
    return (_param === 'undefined' || _param === undefined || _param === '' || _param === null);
}

/**
* Description: isEmptyObject will check the empty object
* @param {object} _obj
* @return {boolean}
*/
function isEmptyObject(_obj) {
    if (_obj == null) return true;// null and undefined are "empty"
    if (_obj.length > 0) return false;
    if (_obj.length === 0) return true;
    for (var key in _obj) {
        if (hasOwnProperty.call(_obj, key)) return false;
    }
    return true;
}
export default COMMON_UTILITIES;
