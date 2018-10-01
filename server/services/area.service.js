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
db.bind('area');
var addAreaService={};

addAreaService.getAllArea=getAllArea;
addAreaService.createNewArea=createNewArea;
addAreaService.getAreaByName=getAreaByName;
addAreaService.getAreaById=getAreaById;
addAreaService.updateArea=updateArea;
addAreaService.deleteArea=deleteArea;

module.exports=addAreaService;

/**
 * Below method returns all Area present in DB
 */
function getAllArea() {
    console.log("Start of getAllArea method of service");
    var deferred = Q.defer();

db.area.find().toArray(function(err,recievedData){
    if(err) deferred.reject(err.name + ':'+err.message);
    deferred.resolve(recievedData);
})

    console.log("End of getAllArea method of service");
    return deferred.promise;
}


/**
 * This method creates new Area Object
 * _id : auto generated id
 * @param {SkillSet} reqParam 
 */
function createNewArea(reqParam) {
    console.log("in start of createNewArea service");
    var deferred = Q.defer();

        // validate if already exist
        db.area.findOne(
            { areaName: reqParam.areaName },
            function (err, area) {
                if (err) deferred.reject(err.name + ': ' + err.message);
    
                if (area) {
                    // username already exists
                    deferred.reject('Area "' + area.areaName + '" is already exist');
                } else {
                    createArea();
                }
            });

            function createArea(){
                db.area.insert(
                    reqParam,
                    function (err, doc) {
                        if (err) deferred.reject(err.name + ': ' + err.message);
            
                        deferred.resolve(doc);
                    });
            }
            console.log("in end of of createNewArea service");
    return deferred.promise;
}

/**
 * This method expects existing skillSet as a parameter. If correct
 * parameter sent will fetch it's object from DB.
 * @param {AreaName} recievedParam 
 */
function getAreaByName(recievedParam){
    console.log("Start of getAreaByName method of service");
    var deferred = Q.defer();
    //db.users.findOne(
    db.area.find({ AreaName: { $regex : new RegExp(recievedParam.AreaName, "i") } })
        .toArray(function (err, recievedData) {
            if (err) deferred.reject(err.name + ': ' + err.message);
        deferred.resolve(recievedData);
        });

    console.log("End of getAreaByName method of service");
    return deferred.promise;
}

function getAreaById(recievedParam){
    console.log("Start of getAreaById method of service");
    var deferred = Q.defer();
    db.area.findById(recievedParam._id,function(err,data)
    {
        if (err) 
            deferred.reject(err.name + ': ' + err.message);
        deferred.resolve(data);
    });
    console.log("End of getAreaById method of service");
    return deferred.promise;
}

function updateArea(reqParam)
{
    
   console.log("updateArea method started for checking similar");
  /*   var  deferred = Q.defer();
    db.area.findOne({areaName:reqParam.areaName},function(err,data){
            if (err)  deferred.reject(err.name + ': ' + err.message);
        if(data){
            deferred.reject('Area "' + JSON.stringify(data) + '" is already exist');
        } else {
        console.log("updateArea method started");
        }
        var set = {
            "areaName": reqParam.areaName,
            "Description":reqParam.Description,
            "modifiedBy": reqParam.modifiedBy,
            "modifiedOn": reqParam.modifiedOn
        };*/
        var  deferred = Q.defer();
        var set = {
            "areaName": reqParam.areaName,
            "Description":reqParam.Description,
            "modifiedBy": reqParam.modifiedBy,
            "modifiedOn": reqParam.modifiedOn
        };
        if(reqParam.areaFlag==false)
        {
            console.log("Only description will be updated");

            updateAreaInnerFunction(set);
        }else{//else block starts here : areaFlag is true
            db.area.findOne(
                {areaName:reqParam.areaName},function(err,data){
                    if (err) 
                         deferred.reject(err.name + ': ' + err.message);
                    else {
                            if(reqParam.areaFlag==true){
                                deferred.reject('Area "' + reqParam.areaName + '" is already exist');
                            } 
                            else if(reqParam.areaFlag==true) {
                            console.log("updateArea method started");
                            }
                        }
                        console.log(reqParam);
                        console.log(reqParam.requestId);

                    updateAreaInnerFunction(set);
                    });
        }//else block end here : areaFlag is true
     
    function updateAreaInnerFunction(set){
        console.log(" in updateAreaInnerFunction start");
        db.area.update(
            { _id: mongo.helper.toObjectID(reqParam.requestId) },
            { $set: set },
            function (err, doc) {
                if (err)
                {
                    console.log(" in updateAreaInnerFunction ends with error");
                    console.log('Err :' + JSON.stringify(err))
                    deferred.reject(err.name + ': ' + err.message);
                }
                
                console.log('doc :' + JSON.stringify(doc))
                console.log(" in updateAreaInnerFunction ends with success");
                deferred.resolve();
            });
    }


    return  deferred.promise;
}

function deleteArea(id)
{
    debugger;
console.log("deleteArea method started");
var deferred = Q.defer();
db.area.remove(
    {_id:mongo.helper.toObjectID(id)},
    function(err){
        if(err) deferred.reject(err.name+':'+err.message);
        deferred.resolve();
    });
console.log("End of deleteArea method of service");
return deferred.promise;
}

