var config = require('config.json');
var express = require('express');
var router = express.Router();

var mailServiceObject = require('../services/mail.service');
var mailTemplatesServiceObject = require('../services/mailTemplates.service');
var mailUtilitiesServiceObject = require('../services/mailUtilities.service');

router.post('/sendTestMail',sendTestMail);
router.post('/sendMailToAdminAfterIQARequestInitiatedByTeam',sendMailToAdminAfterIQARequestInitiatedByTeam);

module.exports = router;


function sendTestMail(req, res) {
    console.log('in sendTestMail function of MailController Start ');
    var bodyObject=req.body;
    console.log("before : "+req.body.mailContent+" : "+req.body.teamName);
    req.body.mailContent=mailTemplatesServiceObject.
            getMailTemplateToBeSentToAdminAfterRequestInitiatedByTeam(req.body);
    console.log("after : "+req.body.mailContent);
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

function sendMailToAdminAfterIQARequestInitiatedByTeam(request, res){
    console.log('in start of sendMailToAdminAfterIQARequestInitiatedByTeam At Controller');
    var bodyObject=request.body;
   
    var fromMailId=bodyObject.fromPersonMailId;
    var toPersonList=bodyObject.toPersonMailId;
    var ccPersonList=bodyObject.ccPersonList;
    var mailSubject=bodyObject.mailSubject;

    var mailContent=mailTemplatesServiceObject.getMailTemplateToBeSentToAdminAfterRequestInitiatedByTeam(bodyObject);

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

