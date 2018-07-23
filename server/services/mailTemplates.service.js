
var mailTemplatesService = {};

mailTemplatesService.getMailTemplateToBeSentToAdminAfterRequestInitiatedByTeam=getMailTemplateToBeSentToAdminAfterRequestInitiatedByTeam;

module.exports = mailTemplatesService;

function getIQAMailSignature(param){
    var signatureText=`<BR><B>Thanks</B>,<BR>`;
    if(param==undefined)
        return  signatureText+=`<B>Team IQA</B>`;
    else
        return  signatureText+='<B>'+param+'</B>';   
}

function getMailTemplateToBeSentToAdminAfterRequestInitiatedByTeam(valuesToBeReplaced){
    var mailContent=`<b>Hello Admin<br><p> Team ${valuesToBeReplaced.teamName} has initiated IQA Reuest with following details, request you to assign it to suitable panel.</b></p>`;
    mailContent+=getIQAMailSignature(undefined);
    return mailContent;
}