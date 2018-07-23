var utilitiesService = {};

utilitiesService.getAllKeysOfJSON=getAllKeysOfJSON;

module.exports = utilitiesService;

function getAllKeysOfJSON(receivedObject) {
    var obj = receivedObject;
    var keys = [];
    for (var k in obj)
        keys.push(k);
    return keys;
}

