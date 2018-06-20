/**
* Summary: customErrorConst, httpErrorConst, validCodes, invalidToken
* Description: define the customErrorConst, httpErrorConst, validCodes, invalidToken
* @author Pawan Gupta
* @date  08.03.2018
*/

export const customErrorConst = {
    NO_TOKEN: 'Token not found.',
    ERROR_LOGIN: 'Error while login.',
    ERROR_DEFAULT: 'Not able to perform this action.',
    800005: "Invalid username or password please try again.",
    800013: "Invalid username or password please try again.",
    110000: "System Error.",
    110001: "Missing User Id.",
    110002: "Missing or invalid Authorization header.",
    110003: "Invalid Token.",
    110004: "Failed to generate token.",
    110005: "Invalid username or password please try again.",
    110006: "Missing Header Body.",
    110007: "New password successfully updated.",
    110008: "Invalid value for:  Password - It is equal to the previous value.",
    110009: "UnsetInitialPasswordExpires.",
    110010: "isEqualToPreviousPassword failed.",
    110011: "updateChangedPasswordList failed.",
    110012: "UnsetInitialPasswordExpires failed.",
    110013: "Invalid username or password please try again.",
    110014: "Attribute name 'newPassword' or it's value is missing.",
    110015: "Bad request.",
    110016: "Authorization Header Missing.",
    110017: "Subscriber Id  not found for the account Number.",
    110018: "Subscriber can't be deleted as it is active or moved.",
    110019: "Access is denied.",
    110020: "Attribute name 'statusCode' or it's value is missing.",
    110021: "Subscriber can't be activated as it is already active or moved.",
    110022: "Subscriber can't be inactivated as it is already inactive or moved.",
    110023: "Allowed status code is 'A' or 'I' only.",
    110024: "HTTP method selected for this request is not allowed.",
    800003: "Invalie Token",
    800030: "Failed to get the STBs assigned to this Subscriber.",
    800031: "Error in getting transaction ids,Query Failed.",
    800032: "Failed to get Transactions details.",
    805004: "Access Point doesnt exists for ExternalId.",
    806016: "Unique value required for Name.",
    800070: "The Package Assignment Start Date and End Date overlap with an existing package assignment.",
    800083: "The Subscription End Date must be greater than the Subscription Start Date.",
    800084: "The Subscription Start Date must be greater than the Package Start Date (set in TotalManage).",
    800085: "The Subscription End Date must be less than the Package End Date (set in TotalManage).",
    800086: "The Subscription Start Date cannot be less than Subscriber Service Start Date.",
    800087: "The Subscription End Date cannot be greater than Subscriber Service End Date.",
    800088: "The Subscription End Date can not be in the past.",
    800089: "The Package Subscription Start Date is after Service End date.",
    800090: "The Package Start Date is after Service End date.",
    806091: "Account number in request url and post data does not match.",
    806092: "Required usoc value.",
    806093: "Account number does not exist in post data.",
    806094: "Required package rate code.",
    805003: "Unique value required for Name."
};

export const httpErrorConst = {
    500: "Internal Server Error."
};

export const validCodes = (code) => {
    if (code >= 200 && code < 400) {
        return true;
    }
    return false;
}

export const invalidToken = {
    401: "401"
}