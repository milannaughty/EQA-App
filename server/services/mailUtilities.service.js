
var utilitiesServiceObject = require('./utililties.service');
var mailUtilitiesService = {};

mailUtilitiesService.validateFromMailIdBeforeSendingMail=validateFromMailIdBeforeSendingMail;
mailUtilitiesService.validateToListBeforeSendingMail=validateToListBeforeSendingMail;
mailUtilitiesService.validateCcListBeforeSendingMail=validateCcListBeforeSendingMail;
mailUtilitiesService.validateMailSubjectBeforeSendingMail=validateMailSubjectBeforeSendingMail;
mailUtilitiesService.validateMailContentBeforeSendingMail=validateMailContentBeforeSendingMail;


module.exports = mailUtilitiesService ;



function validateFromMailIdBeforeSendingMail(reqParameter){
    console.log(reqParameter.fromPersonMailId);
    var keysOfJson= utilitiesServiceObject.getAllKeysOfJSON(reqParameter);
    var errorFlag={"keyNotPresent":"","listIsEmpty":""};
    if(keysOfJson.indexOf("fromPersonMailId")<0)
         errorFlag.keyNotPresent="true";
    if(reqParameter.fromPersonMailId=="")     
         errorFlag.listIsEmpty="true";
    return errorFlag;     
   } 

function validateToListBeforeSendingMail(reqParameter){
    var keysOfJson= utilitiesServiceObject.getAllKeysOfJSON(reqParameter);
    var errorFlag={"keyNotPresent":"","listIsEmpty":""};
    if(keysOfJson.indexOf("toPersonMailId")<0)
         errorFlag.keyNotPresent="true";
    if(reqParameter.toPersonMailId=="")     
         errorFlag.listIsEmpty="true";
    return errorFlag;     
 }

function validateCcListBeforeSendingMail(reqParameter){
 var keysOfJson= utilitiesServiceObject.getAllKeysOfJSON(reqParameter);
 var errorFlag={"keyNotPresent":"","listIsEmpty":""};
 if(keysOfJson.indexOf("ccPersonList")<0)
      errorFlag.keyNotPresent="true";
 if(reqParameter.ccPersonList=="")     
      errorFlag.listIsEmpty="true";
 return errorFlag;     
}  

function validateMailSubjectBeforeSendingMail(reqParameter){
    var keysOfJson= utilitiesServiceObject.getAllKeysOfJSON(reqParameter);
    var errorFlag={"keyNotPresent":"","listIsEmpty":""};
    if(keysOfJson.indexOf("mailSubject")<0)
         errorFlag.keyNotPresent="true";
    if(reqParameter.mailSubject=="")     
         errorFlag.listIsEmpty="true";
    return errorFlag;     
   }

function validateMailContentBeforeSendingMail(reqParameter){
    var keysOfJson= utilitiesServiceObject.getAllKeysOfJSON(reqParameter);
    var errorFlag={"keyNotPresent":"","listIsEmpty":""};
    if(keysOfJson.indexOf("mailContent")<0)
         errorFlag.keyNotPresent="true";
    if(reqParameter.mailContent=="")     
         errorFlag.listIsEmpty="true";
    return errorFlag;     
   }   