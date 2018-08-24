var config = require('config.json');
var express = require('express');
var router = express.Router();

var mailServiceObject = require('../services/mail.service');
var mailTemplatesServiceObject = require('../services/mailTemplates.service');
var mailUtilities = require('../services/mailUtilities.service');

router.post('/sendTestMail', sendTestMail);
router.post('/sendMailToAdminAfterIQARequestInitiatedByTeam', sendMailToAdminAfterIQARequestInitiatedByTeam);
router.post('/sendMailToPanelsAfterPanelsAssignedByAdmin', sendMailToPanelsAfterPanelsAssignedByAdmin);
router.post('/sendMailToAdminsAfterIQARequestRejectedByPanel', sendMailToAdminsAfterIQARequestRejectedByPanel);
router.post('/sendMailToPOCAfterIQARequestAcceptedByPanel', sendMailToPOCAfterIQARequestAcceptedByPanel);
router.post('/sendMailToPOCAfterIQARequestCompletedByPanel', sendMailToPOCAfterIQARequestCompletedByPanel);
router.post('/sendInitialMailToPanel', sendInitialMailToPanel);
router.post('/sendInitialMailToTeam', sendInitialMailToTeam);
router.post('/sendNewlyGeneratedMailToUserForForgotPassword', sendNewlyGeneratedMailToUserForForgotPassword);
router.post('/sendMailToPOCAfterIQARequestMadeUnderVerificationByPanel', sendMailToPOCAfterIQARequestMadeUnderVerificationByPanel);


module.exports = router;

//Declarations
fromMailAddress = mailUtilities.GetFromMailID();

function sendTestMail(req, res) {
    console.log('in sendTestMail function of MailController Start ');
    var bodyObject = req.body;
    console.log("before : " + req.body.mailContent + " : " + req.body.teamName);
    req.body.mailContent = mailTemplatesServiceObject.
        getMailTemplateToBeSentToAdminAfterRequestInitiatedByTeam(req.body);
    console.log("after : " + req.body.mailContent);
    mailServiceObject.sendTestMail(req.body)
        .then(function (emailRes) {
            console.log(emailRes);
            console.log('in sendTestMail function of MailController End');
            res.json('success');
        })
        .catch(function (err) {
            console.log('in sendTestMail function of MailController End with error');
            res.status(400).send(err);
        });
}

function sendMailToAdminAfterIQARequestInitiatedByTeam(request, res) {
    console.log('in start of sendMailToAdminAfterIQARequestInitiatedByTeam At Controller');
    var bodyObject = request.body;

    var fromMailId = bodyObject.fromPersonMailId;
    var toPersonList = bodyObject.toPersonMailId;
    var ccPersonList = bodyObject.ccPersonList;
    var mailSubject = bodyObject.mailSubject;

    var mailContent = mailTemplatesServiceObject.getMailTemplateToBeSentToAdminAfterRequestInitiatedByTeam(bodyObject);

    mailServiceObject.sendMail(
        fromMailId, toPersonList, ccPersonList, mailSubject, mailContent
    ).then(function (emailRes) {
        console.log(emailRes);
        console.log('in sendMailToAdminAfterIQARequestInitiatedByTeam function of MailController End');
        res.json('success');
    })
        .catch(function (err) {
            console.log('in sendMailToAdminAfterIQARequestInitiatedByTeam function of MailController End with error');
            res.status(400).send(err);
        });
    console.log('at end of sendMailToAdminAfterIQARequestInitiatedByTeam At Controller');
}

function sendMailToPanelsAfterPanelsAssignedByAdmin(request, res) {
    console.log('in start of sendMailToPanelsAfterPanelsAssignedByAdmin At Controller');
    var bodyObject = request.body;

    var fromMailId = bodyObject.fromPersonMailId;
    var toPersonList = bodyObject.toPersonMailId;
    var ccPersonList = bodyObject.ccPersonList;
    var mailSubject = bodyObject.mailSubject;

    var mailContent = mailTemplatesServiceObject.getMailTemplateToBeSentToPanelsAfterAssignmentOfPanelByAdmin(bodyObject);

    mailServiceObject.sendMail(
        fromMailId, toPersonList, ccPersonList, mailSubject, mailContent
    ).then(function (emailRes) {
        console.log(emailRes);
        console.log('in sendMailToPanelsAfterPanelsAssignedByAdmin function of MailController End');
        res.json('success');
    })
        .catch(function (err) {
            console.log('in sendMailToPanelsAfterPanelsAssignedByAdmin function of MailController End with error');
            res.status(400).send(err);
        });
    console.log('at end of sendMailToPanelsAfterPanelsAssignedByAdmin At Controller');
}

function sendMailToAdminsAfterIQARequestRejectedByPanel(request, res) {
    console.log('in start of sendMailToAdminsAfterIQARequestRejectedByPanel At Controller');
    var bodyObject = request.body;

    var fromMailId = bodyObject.fromPersonMailId;
    var toPersonList = bodyObject.toPersonMailId;
    var ccPersonList = bodyObject.ccPersonList;
    var mailSubject = bodyObject.mailSubject;

    var mailContent = mailTemplatesServiceObject.getMailTemplateToBeSentToAdminAfterRequestRejctedByPanel(bodyObject);

    mailServiceObject.sendMail(
        fromMailId, toPersonList, ccPersonList, mailSubject, mailContent
    ).then(function (emailRes) {
        console.log(emailRes);
        console.log('in sendMailToAdminsAfterIQARequestRejectedByPanel function of MailController End');
        res.json('success');
    })
        .catch(function (err) {
            console.log('in sendMailToAdminsAfterIQARequestRejectedByPanel function of MailController End with error');
            res.status(400).send(err);
        });
    console.log('at end of sendMailToAdminsAfterIQARequestRejectedByPanel At Controller');
}

function sendMailToPOCAfterIQARequestAcceptedByPanel(request, res) {
    console.log('in start of sendMailToPOCAfterIQARequestAcceptedByPanel At Controller');
    var bodyObject = request.body;

    var fromMailId = bodyObject.fromPersonMailId;
    var toPersonList = bodyObject.toPersonMailId;
    var ccPersonList = bodyObject.ccPersonList;
    var mailSubject = bodyObject.mailSubject;

    var mailContent = mailTemplatesServiceObject.getMailTemplateToBeSentToAdminAfterRequestAcceptedByPanel(bodyObject);

    mailServiceObject.sendMail(
        fromMailId, toPersonList, ccPersonList, mailSubject, mailContent
    ).then(function (emailRes) {
        console.log(emailRes);
        console.log('in sendMailToPOCAfterIQARequestAcceptedByPanel function of MailController End');
        res.json('success');
    })
        .catch(function (err) {
            console.log('in sendMailToPOCAfterIQARequestAcceptedByPanel function of MailController End with error');
            res.status(400).send(err);
        });
    console.log('at end of sendMailToPOCAfterIQARequestAcceptedByPanel At Controller');
}


function sendMailToPOCAfterIQARequestCompletedByPanel(request, res) {
    console.log('in start of sendMailToPOCAfterIQARequestCompletedByPanel At Controller');
    var bodyObject = request.body;

    var fromMailId = bodyObject.fromPersonMailId;
    var toPersonList = bodyObject.toPersonMailId;
    var ccPersonList = bodyObject.ccPersonList;
    var mailSubject = bodyObject.mailSubject;

    var mailContent = mailTemplatesServiceObject.getMailTemplateToBeSentToAdminAfterRequestCompletedByPanel(bodyObject);

    mailServiceObject.sendMail(
        fromMailId, toPersonList, ccPersonList, mailSubject, mailContent
    ).then(function (emailRes) {
        console.log(emailRes);
        console.log('in sendMailToPOCAfterIQARequestCompletedByPanel function of MailController End');
        res.json('success');
    })
        .catch(function (err) {
            console.log('in sendMailToPOCAfterIQARequestCompletedByPanel function of MailController End with error');
            res.status(400).send(err);
        });
    console.log('at end of sendMailToPOCAfterIQARequestCompletedByPanel At Controller');
}

function sendMailToPOCAfterIQARequestMadeUnderVerificationByPanel(request, res) {
    console.log('in start of sendMailToPOCAfterIQARequestMadeUnderVerificationByPanel At Controller');
    var bodyObject = request.body;

    var fromMailId = bodyObject.fromPersonMailId;
    var toPersonList = bodyObject.toPersonMailId;
    var ccPersonList = bodyObject.ccPersonList;
    var mailSubject = bodyObject.mailSubject;

    var mailContent = mailTemplatesServiceObject.getMailTemplateToBeSentToAdminAfterRequestMadeUnderVerificationByPanel(bodyObject);

    mailServiceObject.sendMail(
        fromMailId, toPersonList, ccPersonList, mailSubject, mailContent
    ).then(function (emailRes) {
        console.log(emailRes);
        console.log('in sendMailToPOCAfterIQARequestMadeUnderVerificationByPanel function of MailController End');
        res.json('success');
    })
        .catch(function (err) {
            console.log('in sendMailToPOCAfterIQARequestMadeUnderVerificationByPanel function of MailController End with error');
            res.status(400).send(err);
        });
    console.log('at end of sendMailToPOCAfterIQARequestMadeUnderVerificationByPanel At Controller');
}

function sendInitialMailToPanel(request, res) {
    console.log('in start of sendInitialMailToPanel At Controller');
    var bodyObject = request.body;

    var fromMailId = bodyObject.fromPersonMailId;
    var toPersonList = bodyObject.toPersonMailId;
    var ccPersonList = bodyObject.ccPersonList;
    var mailSubject = bodyObject.mailSubject;

    var mailContent = mailTemplatesServiceObject.getMailTemplateToBeSendFirstMailToPanel(bodyObject);

    mailServiceObject.sendMail(
        fromMailId, toPersonList, ccPersonList, mailSubject, mailContent
    ).then(function (emailRes) {
        console.log(emailRes);
        console.log('in sendInitialMailToPanel function of MailController End');
        res.json('success');
    })
        .catch(function (err) {
            console.log('in sendInitialMailToPanel function of MailController End with error');
            res.status(400).send(err);
        });
    console.log('at end of sendInitialMailToPanel At Controller');
}

function sendInitialMailToTeam(request, res) {
    console.log('in start of sendInitialMailToTeam At Controller');
    var mailObj = request.body;
    var mailContent = mailTemplatesServiceObject.getMailTemplateToBeSendFirstMailToTeam(mailObj);
    sendMail(mailObj.toPersonMailId, mailObj.ccPersonList, mailObj.mailSubject, mailContent, res)
}

function sendMail(to, cc, subject, body, res) {
    mailServiceObject.sendMail(fromMailAddress, to, cc, subject, body)
        .then(function (emailRes) {
            console.log('Email Sent.');
            res.json('success');
        })
        .catch(function (err) {
            console.log('Error in email sending :' + JSON.stringify(err));
            res.status(400).send(err);
        });
}



function sendNewlyGeneratedMailToUserForForgotPassword(request, res) {
    console.log('in start of sendNewlyGeneratedMailToUserForForgotPassword At Controller');
    var bodyObject = request.body;

    var fromMailId = bodyObject.fromPersonMailId;
    var toPersonList = bodyObject.toPersonMailId;
    var ccPersonList = bodyObject.ccPersonList;
    var mailSubject = bodyObject.mailSubject;

    var mailContent = mailTemplatesServiceObject.getMailTemplateTobeSentToUserAfterGeneratingNewPassword(bodyObject);

    mailServiceObject.sendMail(
        fromMailId, toPersonList, ccPersonList, mailSubject, mailContent
    ).then(function (emailRes) {
        console.log(emailRes);
        console.log('in sendNewlyGeneratedMailToUserForForgotPassword function of MailController End');
        res.json('success');
    })
        .catch(function (err) {
            console.log('in sendNewlyGeneratedMailToUserForForgotPassword function of MailController End with error');
            res.status(400).send(err);
        });
    console.log('at end of sendNewlyGeneratedMailToUserForForgotPassword At Controller');
}


