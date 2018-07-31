var utilitiesService = {};

utilitiesService.getAllKeysOfJSON = getAllKeysOfJSON;
utilitiesService.getFirstNameFromEmail = getFirstNameFromEmail;
utilitiesService.getLastNameFromEmail = getLastNameFromEmail;
utilitiesService.IsNullOrUndefined = IsNullOrUndefined;
utilitiesService.IsUndefined = IsUndefined;
module.exports = utilitiesService;

function getAllKeysOfJSON(receivedObject) {
    var obj = receivedObject;
    var keys = [];
    for (var k in obj)
        keys.push(k);
    return keys;
}

function getFirstNameFromEmail(email) {
    return email.substring(0, email.indexOf('@', 0)).split('.')[0].charAt(0).toUpperCase()
        + email.substring(0, email.indexOf('@', 0)).split('.')[0].slice(1);
}

function getLastNameFromEmail(email) {
    return email.substring(0, email.indexOf('@', 0)).split('.')[1].charAt(0).toUpperCase()
        + email.substring(0, email.indexOf('@', 0)).split('.')[1].slice(1);
}

function IsNullOrUndefined(obj) {
    return obj == null || obj == undefined;
}

function IsUndefined(obj) {
    return obj == undefined;
}