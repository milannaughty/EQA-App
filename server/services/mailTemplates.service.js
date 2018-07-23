
var mailTemplatesService = {};

mailTemplatesService.getMailTemplateToBeSentToAdminAfterRequestInitiatedByTeam=getMailTemplateToBeSentToAdminAfterRequestInitiatedByTeam;
mailTemplatesService.getMailTemplateToBeSentToPanelsAfterAssignmentOfPanelByAdmin=getMailTemplateToBeSentToPanelsAfterAssignmentOfPanelByAdmin;

module.exports = mailTemplatesService;

function getIQAMailSignature(param){
    var signatureText=`<BR><B>Thanks</B>,<BR>`;
    if(param==undefined)
        return  signatureText+=`<B>Team IQA</B>`;
    else
        return  signatureText+='<B>'+param+'</B>';   
}

/**
 * This method generates template, expects teamName key of a Team Name who has initiated this request.
 * @param {requestObject.teamName} valuesToBeReplaced 
 */
function getMailTemplateToBeSentToAdminAfterRequestInitiatedByTeam(valuesToBeReplaced){
    var mailContent=`<b>Hello Admin,<br><p> Team ${valuesToBeReplaced.teamName} has initiated IQA Reuest with following details, request you to assign it to suitable panel.</b></p>`;
    mailContent+=getIQAMailSignature(undefined);
    return mailContent;
}

/**
 * This method expects 2 keys in request object, as it expects toPersonNames and teamName in template.
 * @param {requestObject.toPersonName && requestObject.teamName} valuesToBeReplaced 
 */
function getMailTemplateToBeSentToPanelsAfterAssignmentOfPanelByAdmin(valuesToBeReplaced){
    var mailContent=`<b>Hello ${valuesToBeReplaced.toPersonName},<br><p>You have been assigned as Panel for IQA Request Initiated By Team ${valuesToBeReplaced.teamName}.Request you to take neccessary actions.</b></p>`;
    mailContent+=getIQAMailSignature(undefined);
    return mailContent;
}