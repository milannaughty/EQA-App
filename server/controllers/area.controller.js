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
var addAreaServiceObject=require('../services/area.service');
var utilitiesServiceObject = require('../services/utililties.service');


router.get(['/getAllArea','/'], getAllAreaFromDB);
router.post(['/createNewArea'], postNewAreaObjectToDB);
router.get(['/getAreaByName'],getAreaByNameFromDB);
router.get(['/getAreaById'],getAreaByIdFromDb);
router.post(['/updateArea'],updateAreaToDb);
router.delete(['/deleteArea'],deleteAreaFromDb);
module.exports=router;

function getAllAreaFromDB(request,response)
{
   console.log("In start of getAllAreaFromDB method");
    
   addAreaServiceObject.getAllArea().then(function(element)
    {
        console.log("Fetching Area Operation Completed");
        response.send(element);
    }).catch(function (err){
        console.log("Fetching Area operation completed with errors");
        response.status(400).send(err);
    })
}

function postNewAreaObjectToDB(request, response){
    console.log("In start of  postNewAreaObjectToDB method");
    // if(!request.query.hasOwnProperty("skillName")){
    //     response.status(400).send("Please use appropriate query parameter to fetch Skillsets");
    // }
   // console.log(request.body)

    var validatedMssage=validateAreaObjectBeforeCreatingNew(request.body);
    if(validatedMssage.length!=0){
        console.log("Error occured while validating request body "+validatedMssage);
        response.status(400).send(validatedMssage);
    }

    addAreaServiceObject.createNewArea(request.body)
            .then(function (element) {
                console.log("Area created successfully with following details : "+ JSON.stringify(element));
                response.send(element);
            }).catch(function (err) {
                console.log("Error occured while creating Area error details : " +JSON.stringify(err));
                response.status(400).send(err);
            })
    }

    function validateAreaObjectBeforeCreatingNew(receivedObject ){
        console.log("In start of validateAreaObjectBeforeCreatingNew method");
        var errorMessage ="";
        var keys = utilitiesServiceObject.getAllKeysOfJSON(receivedObject);
        if(keys.length!=8){
            errorMessage+="no. of key mismatch expected 8. found "+keys.length+" ";
        }
        if(keys.indexOf("areaName") < 0){
            errorMessage+=" key AreaName not found ";
        }
        if(keys.indexOf("Description") < 0){
            errorMessage+=" key Description not found ";
        }
        if(keys.indexOf("createdBy") < 0){
            errorMessage+=" key createdBy not found ";
        }
        if(keys.indexOf("createdOn") < 0){
            errorMessage+=" key createdOn not found ";
        }
        if(keys.indexOf("modifiedBy")<0){
            errorMessage+=" key modifiedBy not found ";
        }
        if(keys.indexOf("modifiedOn")<0){
            errorMessage+=" key modifiedOn not found ";
        }
        if(keys.indexOf("isDeleted")<0)
        {
            errorMessage+="key isDeleted not found";
        }
        if(keys.indexOf("status")<0)
        {
            errorMessage+="key Status not found";
        }
        
        // if(checkIfSkillSetAllreadyExists(receivedObject)){
        //     errorMessage+=" "+JSON.stringify(receivedObject)+" already exists ";
        // }

        console.log("In start of validateAreaObjectBeforeCreatingNew method");
        return errorMessage;
    }

    function getAreaByNameFromDB(request,response){
        console.log("In start of getAreaByNameFromDB method ");
        //console.log(request.query);
        if(!request.query.hasOwnProperty("AreaName")){
            response.status(400).send("Please use appropriate query parameter to fetch AreaName");
        }
        addAreaServiceObject.getAreaByName(request.query)
                .then(function (element) 
                {
                    console.log("fetching Area operation completed");
                    response.send(element);
                }).catch(function (err)
                {
                    console.log("fetching Area operation completed with error " +JSON.stringify(err));
                    response.status(400).send(err);
                })

    }

    function getAreaByIdFromDb(request,response)
    {
        console.log("In start of getAreaByIdFromDb method");
        console.log(request.query);
        if(!request.query.hasOwnProperty("_id"))
        {
            response.status(400).send("Please use appropriate query parameter to fetch Area");
        }
        addAreaServiceObject.getAreaById(request.query).then(function(element){
            console.log("fetching area operation completed");
            response.send(element);
        }).catch(function (err)
        {
            console.log("fetching area operation completed with error " +JSON.stringify(err));
            response.status(400).send(err);
        })
    }

    function updateAreaToDb(request,response)
    {
        console.log("In start of updateAreaController method" );
        console.log(request.body);
        
        addAreaServiceObject.updateArea(request.body).then
      (
                function(element){
                    console.log("updating area complete successfully");
                    response.status(200).send(element);
                }
            ).catch(function(err){
                console.log("updating area complete successfully");
                response.status(400).send(err);
            })

    }

    function deleteAreaFromDb(req,res)
    {
        console.log("In start of deleteArea method");
        console.log(req.query);
        addAreaServiceObject.deleteArea(req.query.id)
        .then(function(){
            console.log("In start of deleteArea method : success");
            res.json('success');
        }).catch(function (err){
            console.log("In start of deleteArea method Error");
            res.status(400).send(err);
        })

    }

    