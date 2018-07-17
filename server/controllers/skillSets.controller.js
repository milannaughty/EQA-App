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

/**
 * here you have to mention method name from controller it self
 */
router.get(['/getAllSkillSets','/'], getAllSkillSetsFromDB);
router.get('/getAllSkillSetsByType', getAllSkillSetsByTypeFromDB);
router.get('/getAllSkillSetById', getAllSkillSetsByIdFromDB);
router.get('/getSkillSetByName', getSkillsByNameFromDB);

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
    console.log();
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