/**
 * config properties can be pulled with config object
 */
var config = require('config.json');
/**
 * express package provides server support and it also provides us routers to expose services
 */
var express = require('express');
/**
 * Routers are used expose services
 */
var router = express.Router();

var skillsetsServiceObject = require('../services/skillsets.service');
var utilitiesServiceObject = require('../services/utililties.service');

/**
 * here you have to mention method name from controller it self
 */
router.get(['/getAllSkillSets','/'], getAllSkillSetsFromDB);
router.get('/getAllSkillSetsByType', getAllSkillSetsByTypeFromDB);
router.get('/getAllSkillSetById', getAllSkillSetsByIdFromDB);
router.get('/getSkillSetByName', getSkillsByNameFromDB);
router.get('/getSkillSetByPanel', GetSkillSetByPanel);
router.post('/createNewSkillSet',postNewSkillSetObjectToDB);
router.put('/updateSkillSet',updateSkillSetObjectToDB);
router.delete('/deleteSkillSet', deleteSkillSet);


module.exports = router;

function getAllSkillSetsFromDB(request, response){
    console.log("In start of getAllSkillSetsFromDB method");
    
    skillsetsServiceObject.getAllSkillSets()
            .then(function (element) {
                console.log("fetching skillsets operation completed");
                response.send(element);
            }).catch(function (err) {
                console.log("fetching skillsets operation completed with error " +JSON.stringify(err));
                response.status(400).send(err);
            })
}

function getAllSkillSetsByTypeFromDB(request, response){
    console.log("In start of getAllSkillSetsByTypeFromDB method");
    
    if(!request.query.hasOwnProperty("type")){
        response.status(400).send("Please use appropriate query parameter to fetch Skillsets");
    }
    skillsetsServiceObject.getSkillsByType(request.query)
            .then(function (element) {
                console.log("fetching skillsets operation completed");
                response.send(element);
            }).catch(function (err) {
                console.log("fetching skillsets operation completed with error " +JSON.stringify(err));
                response.status(400).send(err);
            })
}

function getAllSkillSetsByIdFromDB(request, response){
    console.log("In start of getAllSkillSetsByIdFromDB method");
    console.log(request.query);
    if(!request.query.hasOwnProperty("_id")){
        response.status(400).send("Please use appropriate query parameter to fetch Skillsets");
    }
    skillsetsServiceObject.getSkillSetsById(request.query)
            .then(function (element) {
                console.log("fetching skillsets operation completed");
                response.send(element);
            }).catch(function (err) {
                console.log("fetching skillsets operation completed with error " +JSON.stringify(err));
                response.status(400).send(err);
            })
}

function getSkillsByNameFromDB(request, response){
    console.log("In start of getSkillsByNameFromDB method");
    //console.log(request.query);
    if(!request.query.hasOwnProperty("skillName")){
        response.status(400).send("Please use appropriate query parameter to fetch Skillsets");
    }
    skillsetsServiceObject.getSkillsByName(request.query)
            .then(function (element) {
                console.log("fetching skillsets operation completed");
                response.send(element);
            }).catch(function (err) {
                console.log("fetching skillsets operation completed with error " +JSON.stringify(err));
                response.status(400).send(err);
            })
}

function GetSkillSetByPanel(request, response){
    console.log("GetSkillSetByPanel started...");
    console.log("Panel : "+request.query._id);
    skillsetsServiceObject.GetSkillsByPanelID(request.query._id)
            .then(function (element) {
                console.log("GetSkillSetByPanel completed");
                response.send(element);
            }).catch(function (err) {
                console.log("GetSkillSetByPanel completed with error " +JSON.stringify(err));
                response.status(400).send(err);
            })
}

function postNewSkillSetObjectToDB(request, response){
    console.log("In start of postNewSkillSetObjectToDB method");
    // if(!request.query.hasOwnProperty("skillName")){
    //     response.status(400).send("Please use appropriate query parameter to fetch Skillsets");
    // }
   // console.log(request.body)

    var validatedMssage=validateSkillSetObjectBeforeCreatingNew(request.body);
    if(validatedMssage.length!=0){
        console.log("Error occured while validating request body "+validatedMssage);
        response.status(400).send(validatedMssage);
    }

    skillsetsServiceObject.createNewSkillSet(request.body)
            .then(function (element) {
                console.log("Skill Set created successfully with following details : "+ JSON.stringify(element));
                response.send(element);
            }).catch(function (err) {
                console.log("Error occured while creating SkillSet error details : " +JSON.stringify(err));
                response.status(400).send(err);
            })
    }

    function validateSkillSetObjectBeforeCreatingNew(receivedObject ){
        console.log("In start of validateSkillSetObjectBeforeCreatingNew method");
        var errorMessage ="";
        var keys = utilitiesServiceObject.getAllKeysOfJSON(receivedObject);
        if(keys.length!=4){
            errorMessage+="no. of key mismatch expected 4. found "+keys.length+" ";
        }
        if(keys.indexOf("skillName") < 0){
            errorMessage+=" key skillName not found ";
        }
        if(keys.indexOf("type")<0){
            errorMessage+=" key type not found ";
        }
        if(keys.indexOf("createdBy") < 0){
            errorMessage+=" key createdBy not found ";
        }
        if(keys.indexOf("createdOn") < 0){
            errorMessage+=" key createdOn not found ";
        }
        // if(checkIfSkillSetAllreadyExists(receivedObject)){
        //     errorMessage+=" "+JSON.stringify(receivedObject)+" already exists ";
        // }

        console.log("In start of validateSkillSetObjectBeforeCreatingNew method");
        return errorMessage;
    }

function checkIfSkillSetAllreadyExists(receivedObject){
    console.log("In start of checkIfSkillSetAllreadyExists method");

    skillsetsServiceObject.getSkillsByName(receivedObject).then(function (element) {
            console.log(" object exists");
            if(element.length==0)
                return false;
            else
                return true;
        }).catch(function (err) {
            console.log("object doesn't exists " +JSON.stringify(err));
            return false;
        })
        console.log("In end of checkIfSkillSetAllreadyExists method");
    return false;
}

function updateSkillSetObjectToDB(request,response){
    console.log("In start of updateSkillInController method" );
    console.log(request.body);
    
    skillsetsServiceObject.updateSkillSet(request.body).then(
            function(element){
                console.log("updating skill complete successfully");
                response.status(200).send(element);
            }
        ).catch(function(err){
            console.log("updating skill complete successfully");
            response.status(400).send(err);
        })
}
function deleteSkillSet(req, res) {
    console.log("In start of deleteSkillSet method" );
    console.log(req.query);
    skillsetsServiceObject.deleteSkillSet(req.query.id)
        .then(function () {
            console.log("In start of deleteSkillSet method : Success" );
            res.json('success');
            
        })
        .catch(function (err) {
            console.log("In start of deleteSkillSet method Error" );
            res.status(400).send(err);
            
        });
}





    