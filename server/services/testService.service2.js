var config = require('config.json');
var Q = require('q');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true });
db.bind('testservicetable');

var service34={};

service34.getTestText=getTestText;
service34.testServiceInsertMethod=testServiceInsertMethod;

module.exports = service34;

function getTestText(param1){
    console.log("sddsewfvbftgr "+param1.qry);
    var deferred = Q.defer();
        deferred.resolve({value:"Test Text"});
    return deferred.promise;
}

function testServiceInsertMethod(reqParam) {
    var deferred = Q.defer();

    db.testservicetable.insert(
        reqParam,
        function (err, doc) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });

    return deferred.promise;
}