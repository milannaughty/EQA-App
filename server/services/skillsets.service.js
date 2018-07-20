/**
 * Below line is to fetch config properties from {config.JSON} file
 */
var config = require('config.json');

var Q = require('q');
var mongo = require('mongoskin');
/**
 * Below line is to get DB connection
 */
var db = mongo.db(config.connectionString, { native_parser: true });
/**
 * below line is to bind with table
 */
db.bind('skillSets');

var skillSetService={};

skillSetService.getAllSkillSets=getAllSkillSets;
skillSetService.getSkillsByType=getSkillsByType;
skillSetService.getSkillSetsById=getSkillSetsById;
skillSetService.getSkillsByName=getSkillsByName;
skillSetService.createNewSkillSet=createNewSkillSet;

module.exports = skillSetService;

/**
 * Below method returns all skill Sets present in DB
 */
function getAllSkillSets() {
    console.log("Start of getAllSkillSets method of service");
    var deferred = Q.defer();

    db.skillSets.find().toArray(function (err, recievedData) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        deferred.resolve(recievedData);
    });
    console.log("End of getAllSkillSets method of service");
    return deferred.promise;
}

/**
 * This method fetches all skill sets matching with passed type Dev or QA
 * @param {Type} recievedParam 
 */
function getSkillsByType(recievedParam){
    console.log("Start of getSkillsByType method of service");
    var deferred = Q.defer();
    //db.users.findOne(
    db.skillSets.find({ type: { $regex : new RegExp(recievedParam.type, "i") } })
        .toArray(function (err, recievedData) {
            if (err) deferred.reject(err.name + ': ' + err.message);
    
            deferred.resolve(recievedData);
        });

    console.log("End of getSkillsByType method of service");
    return deferred.promise;
}

/**
 * This method fetches single SkillSet on the basis of ID
 * @param {idOfSkill} recievedParam 
 */
function getSkillSetsById(recievedParam) {
    console.log("Start of getSkillSetsById method of service");
    var deferred = Q.defer();
    //console.log(recievedParam._id);
    db.skillSets.findById(recievedParam._id, function (err, skill) {
        if (err) 
            deferred.reject(err.name + ': ' + err.message);
        deferred.resolve(skill);
     });
    console.log("End of getSkillSetsById method of service");
    return deferred.promise;
}

/**
 * This method expects existing skillSet as a parameter. If correct
 * parameter sent will fetch it's object from DB.
 * @param {skillName} recievedParam 
 */
function getSkillsByName(recievedParam){
    console.log("Start of getSkillsByName method of service");
    var deferred = Q.defer();
    //db.users.findOne(
    db.skillSets.find({ skillName: { $regex : new RegExp(recievedParam.skillName, "i") } })
        .toArray(function (err, recievedData) {
            if (err) deferred.reject(err.name + ': ' + err.message);
    
            deferred.resolve(recievedData);
        });

    console.log("End of getSkillsByName method of service");
    return deferred.promise;
}

/**
 * This method creates new SkillSet Object
 * _id : auto generated id
 * type : QA or Dev
 * skillName : Actual skill name
 * @param {SkillSet} reqParam 
 */
function createNewSkillSet(reqParam) {
    var deferred = Q.defer();

        // validate if already exist
        db.skillSets.findOne(
            { skillName: reqParam.skillName },
            function (err, skillSet) {
                if (err) deferred.reject(err.name + ': ' + err.message);
    
                if (skillSet) {
                    // username already exists
                    deferred.reject('Skill "' + skillSet.skillName + '" is already exist');
                } else {
                    createSkillSet();
                }
            });

            function createSkillSet(){
                db.skillSets.insert(
                    reqParam,
                    function (err, doc) {
                        if (err) deferred.reject(err.name + ': ' + err.message);
            
                        deferred.resolve();
                    });
            }

    return deferred.promise;
}