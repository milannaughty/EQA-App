var utilitiesServiceObject = require('./utililties.service');
var mailUtilitiesServiceObject = require('./mailUtilities.service');
var mailTemplatesService = {};

mailTemplatesService.getMailTemplateToBeSentToAdminAfterRequestInitiatedByTeam = getMailTemplateToBeSentToAdminAfterRequestInitiatedByTeam;
mailTemplatesService.getMailTemplateToBeSentToPanelsAfterAssignmentOfPanelByAdmin = getMailTemplateToBeSentToPanelsAfterAssignmentOfPanelByAdmin;
mailTemplatesService.getMailTemplateToBeSentToAdminAfterRequestRejctedByPanel = getMailTemplateToBeSentToAdminAfterRequestRejctedByPanel;
mailTemplatesService.getMailTemplateToBeSentToAdminAfterRequestAcceptedByPanel = getMailTemplateToBeSentToAdminAfterRequestAcceptedByPanel;
mailTemplatesService.getMailTemplateToBeSendFirstMailToPanel = getMailTemplateToBeSendFirstMailToPanel;
mailTemplatesService.getMailTemplateToBeSendFirstMailToTeam = getMailTemplateToBeSendFirstMailToTeam;
mailTemplatesService.getMailTemplateTobeSentToUserAfterGeneratingNewPassword = getMailTemplateTobeSentToUserAfterGeneratingNewPassword;
mailTemplatesService.getMailTemplateToBeSentToAdminAfterRequestCompletedByPanel = getMailTemplateToBeSentToAdminAfterRequestCompletedByPanel;
mailTemplatesService.getMailTemplateToBeSentToAdminAfterRequestMadeUnderVerificationByPanel = getMailTemplateToBeSentToAdminAfterRequestMadeUnderVerificationByPanel;
mailTemplatesService.getMailTemplateforUsersfeedback = getMailTemplateforUsersfeedback;
mailTemplatesService.TeamReviewFeedback = TeamReviewFeedback;

module.exports = mailTemplatesService;



/**
 * This method generates template, expects teamName key of a Team Name who has initiated this request.
 * @param {requestObject.teamName} valuesToBeReplaced 
 */
function getMailTemplateToBeSentToAdminAfterRequestInitiatedByTeam(valuesToBeReplaced) {
    var mailContent = `Hello Admin,<br><p> Team ${valuesToBeReplaced.teamName} has initiated IQA Reuest with following details, request you to assign it to suitable panel.</b></p>`;
    //mailContent += getIQAMailSignature(undefined);
    return mailUtilitiesServiceObject.FormulateEmailBodyTemplate(mailContent);
}

/**
 * This method expects 2 keys in request object, as it expects toPersonNames and teamName in template.
 * @param {requestObject.toPersonName && requestObject.teamName} valuesToBeReplaced 
 */
function getMailTemplateToBeSentToPanelsAfterAssignmentOfPanelByAdmin(valuesToBeReplaced) {
    var mailContent = `Hello ${valuesToBeReplaced.toPersonName},	<br>	<p>You have been assigned as Panel for IQA Request Initiated By Team <b>${valuesToBeReplaced.teamName}</b>.<br>	Request you to take neccessary actions.	</p>`;
    return mailUtilitiesServiceObject.FormulateEmailBodyTemplate(mailContent);
}

/**
 * this method generates template for mail to be send after rejected by Panel
 * @param {requestObject.sprintName && requestObject.panelName && requestObject.rejectReason} valuesToBeReplaced 
 */
function getMailTemplateToBeSentToAdminAfterRequestRejctedByPanel(valuesToBeReplaced) {
    var mailContent = `Hello Admin,<br><p> IQA request ${valuesToBeReplaced.sprintName} is rejected by ${valuesToBeReplaced.panelName}. Reason is : ${valuesToBeReplaced.rejectReason}. Request you to take neccessary actions.</b></p>`;
    //mailContent += getIQAMailSignature(undefined);
    return mailUtilitiesServiceObject.FormulateEmailBodyTemplate(mailContent);
}
/**
 * this method generates template for mail to be send after Accepted by Panel
 * @param {requestObject.sprintName && requestObject.panelName} valuesToBeReplaced 
 */
function getMailTemplateToBeSentToAdminAfterRequestAcceptedByPanel(valuesToBeReplaced) {
    var email = valuesToBeReplaced.panelName;
    var firstName = utilitiesServiceObject.getFirstNameFromEmail(email);
    var lastName = utilitiesServiceObject.getLastNameFromEmail(email);

    var mailContent = `Hello ${valuesToBeReplaced.toPersonName},<br><p> IQA request ${valuesToBeReplaced.sprintName} is accepted by ${firstName} ${lastName} . Request you to cordinate with ${firstName} ${lastName} for further IQA process. feel free to contact panel with email ${valuesToBeReplaced.panelName} </b></p>`;
    return mailUtilitiesServiceObject.FormulateEmailBodyTemplate(mailContent);
}
/**
 * this method generates template for mail to be send after IQA Request Completed by Panel
 * @param {requestObject.sprintName && requestObject.panelName} valuesToBeReplaced 
 */
function getMailTemplateToBeSentToAdminAfterRequestCompletedByPanel(valuesToBeReplaced) {
    var email = valuesToBeReplaced.panelName;
    var firstName = utilitiesServiceObject.getFirstNameFromEmail(email);
    var lastName = utilitiesServiceObject.getLastNameFromEmail(email);

    var mailContent = `Hello ${valuesToBeReplaced.toPersonName},<br><p>This is to inform you IQA request ${valuesToBeReplaced.sprintName} is completed by ${firstName} ${lastName}.</b></p>`;
    //mailContent += getIQAMailSignature(undefined);
    return mailUtilitiesServiceObject.FormulateEmailBodyTemplate(mailContent);
}

/**
 * this method generates template for mail to be send after IQA Request made under verification by Panel
 * @param {requestObject.sprintName && requestObject.panelName && requestObject.toPersonName && requestObject.panelComments && requestObject.checkListDetails} valuesToBeReplaced 
 */
function getMailTemplateToBeSentToAdminAfterRequestMadeUnderVerificationByPanel(valuesToBeReplaced) {
    var email = valuesToBeReplaced.panelName;
    var firstName = utilitiesServiceObject.getFirstNameFromEmail(email);
    var lastName = utilitiesServiceObject.getLastNameFromEmail(email);

    var mailContent = `Hello ${valuesToBeReplaced.toPersonName},<br><p>This is to inform you IQA request for ${valuesToBeReplaced.sprintName} is reviewed by ${firstName} ${lastName}.<br>Request you to review the comments and take necessary action.`;

    //mailContent += mailUtilitiesServiceObject.getTabularData(valuesToBeReplaced.checkListDetails, 2, 'Checklists Details', 'Checklist Item|Status', '|');

    //mailContent += '<BR><b>Request you to take neccessary action</b><BR><HR>';
    // mailContent += getIQAMailSignature(undefined);
    return mailUtilitiesServiceObject.FormulateEmailBodyTemplate(mailContent);
}

/**
 * This method generates template for mail to be sent first mail to Panel, 
 * @param {requestObject.sprintName && requestObject.panelName && requestObject.rejectReason} valuesToBeReplaced 
 */
function getMailTemplateToBeSendFirstMailToPanel(valuesToBeReplaced) {

    var firstName = valuesToBeReplaced.toPersonName;

    var mailContent = `Hello ${firstName},<br><p>This is to inform you. You have been introduced as ${valuesToBeReplaced.panelType} for IQA process. Your credentials for login are as below</b></p><br>`;
    mailContent += `<div class=WordSection1><table class=MsoNormalTable border=0 cellspacing=0 cellpadding=0 style='border-collapse:collapse'><tr><td valign=top style='border:solid windowtext 1.0pt;padding:0in 5.4pt 0in 5.4pt'><p class=MsoNormal>User Name<o:p></o:p></p></td><td valign=top style='border:solid windowtext 1.0pt;border-left:none;padding:0in 5.4pt 0in 5.4pt'><p class=MsoNormal>Password<o:p></o:p></p></td></tr><tr><td valign=top style='border:solid windowtext 1.0pt;border-top:none;padding:0in 5.4pt 0in 5.4pt'><p class=MsoNormal>${valuesToBeReplaced.toPersonMailId}<o:p></o:p></p></td><td valign=top style='border-top:none;border-left:none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;padding:0in 5.4pt 0in 5.4pt'><p class=MsoNormal>${valuesToBeReplaced.initialPassword}<o:p></o:p></p></td></tr></table><p class=MsoNormal><o:p>&nbsp;</o:p></p></div>`;
    //mailContent += getIQAMailSignature(undefined);
    return mailUtilitiesServiceObject.FormulateEmailBodyTemplate(mailContent);
}

/**
 * This method generates template for mail to be sent first mail to Panel, 
 * @param {requestObject.sprintName && requestObject.panelName && requestObject.rejectReason} valuesToBeReplaced 
 */
function getMailTemplateToBeSendFirstMailToTeam(valuesToBeReplaced) {

    var pocName = utilitiesServiceObject.getFirstNameFromEmail(valuesToBeReplaced.POCEmail);

    var mailContent = `Hello ${pocName} ,<br><p>This is to inform you. Team ${valuesToBeReplaced.teamName} is registered as Team for IQA process. Your credentials for login are as below</b></p><br>`;

    mailContent += `<div class=WordSection1><table class=MsoNormalTable border=0 cellspacing=0 cellpadding=0 style='border-collapse:collapse'><tr><td valign=top style='border:solid windowtext 1.0pt;padding:0in 5.4pt 0in 5.4pt'><p class=MsoNormal>User Name<o:p></o:p></p></td><td valign=top style='border:solid windowtext 1.0pt;border-left:none;padding:0in 5.4pt 0in 5.4pt'><p class=MsoNormal>Password<o:p></o:p></p></td></tr><tr><td valign=top style='border:solid windowtext 1.0pt;border-top:none;padding:0in 5.4pt 0in 5.4pt'><p class=MsoNormal>${valuesToBeReplaced.username}<o:p></o:p></p></td><td valign=top style='border-top:none;border-left:none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;padding:0in 5.4pt 0in 5.4pt'><p class=MsoNormal>${valuesToBeReplaced.initialPassword}<o:p></o:p></p></td></tr></table><p class=MsoNormal><o:p>&nbsp;</o:p></p></div>`;
    mailContent += `<br><br><p>You are requested to change your credentials with your first login.</p><br>`;
    //mailContent += getIQAMailSignature(undefined);

    return mailUtilitiesServiceObject.FormulateEmailBodyTemplate(mailContent);
}

function getMailTemplateTobeSentToUserAfterGeneratingNewPassword(valuesToBeReplaced) {

    var name = utilitiesServiceObject.getFirstNameFromEmail(valuesToBeReplaced.toPersonMailId);
    var mailContent = `Hello ${name},<br><p>Your new password for IQA process is as below, request you to login with your username and new password.</b></p>`;
    mailContent += `<div class=WordSection1><table class=MsoNormalTable border=0 cellspacing=0 cellpadding=0 style='border-collapse:collapse'><tr><td valign=top style='border:solid windowtext 1.0pt;padding:0in 5.4pt 0in 5.4pt'><p class=MsoNormal>User Name<o:p></o:p></p></td><td valign=top style='border:solid windowtext 1.0pt;border-left:none;padding:0in 5.4pt 0in 5.4pt'><p class=MsoNormal>Password<o:p></o:p></p></td></tr><tr><td valign=top style='border:solid windowtext 1.0pt;border-top:none;padding:0in 5.4pt 0in 5.4pt'><p class=MsoNormal>${valuesToBeReplaced.username}<o:p></o:p></p></td><td valign=top style='border-top:none;border-left:none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;padding:0in 5.4pt 0in 5.4pt'><p class=MsoNormal>${valuesToBeReplaced.password}<o:p></o:p></p></td></tr></table><p class=MsoNormal><o:p>&nbsp;</o:p></p></div>`;
    //mailContent += getIQAMailSignature(undefined);
    return mailUtilitiesServiceObject.FormulateEmailBodyTemplate(mailContent);
}

/**
 * this method generates template for mail to be send after rejected by Panel
 * @param {requestObject.feedback} valuesToBeReplaced 
 */
function getMailTemplateforUsersfeedback(valuesToBeReplaced) {

    return mailUtilitiesServiceObject.FormulateEmailBodyTemplate(`<div style='font-family:"Calibri",sans-serif;color:#1F3864;'><strong>Hello Team IQA</strong>,<br><p > We have recieved new feedback from <a href="mailto:${valuesToBeReplaced.fromPersonMailId}?subject=IQA Team|Feedback From  - ${valuesToBeReplaced.emailSender}&body=Thanks for your valuable feedback. We will be looking into it and get back to you soon. :)">${valuesToBeReplaced.emailSender}</a>
    <BR><strong>Feedback:</strong><i><p> ${valuesToBeReplaced.feedback}</i> </p><br></div>`);

}

/**
 * This method generates template for mail to be sent first mail to Panel, 
 * @param {requestObject.sprintName && requestObject.panelName && requestObject.rejectReason} valuesToBeReplaced 
 */
function TeamReviewFeedback(valuesToBeReplaced) {

    var mailContent = `Hello ${valuesToBeReplaced.toPersonName},<br><p>This is to inform you that, Team ${valuesToBeReplaced.teamName} has provided review feedback.</p>`;
    mailContent += `Request you to please review the comments from team and update the IQA status.`;
    //mailContent += getIQAMailSignature(undefined);
    return mailUtilitiesServiceObject.FormulateEmailBodyTemplate(mailContent);
}