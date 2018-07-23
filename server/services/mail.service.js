var nodemailer= require('nodemailer');
var Q = require('q');

var mailSendingService = {};

mailSendingService.sendTestMail=sendTestMail;
mailSendingService.sendMail=sendMail;
module.exports = mailSendingService;

function getGmailTransporter(){
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
                 user: 'krishnayaldi@gmail.com',
                 pass: 'kalyani123'
            }
    });
}

function getNihilentMailTransporter(){
    return nodemailer.createTransport({
        host: '172.16.1.4', 
        secureConnection: true,
        transportProtocol:'smtp',
        port: 25,
        auth:false,
        tls:false
    });
}

function sendTestMail(reqParam) {
    var deferred = Q.defer();

    console.log('Email Sending started.')
    // create reusable transporter object using the default SMTP transport
    var transporter = getNihilentMailTransporter();

    var gmailTransporter = getGmailTransporter();

    var mailContent=reqParam.mailContent;

    var mailOptions = {
        from: 'krishna.yaldi@nihilent.com', // sender address
        to: '"Krishna Yaldi" <krishna.yaldi@nihilent.com>', // list of receivers
        subject: reqParam.mailSubject, 
        text: 'Sending Email Using Node JS?sd', // plain text body
        html: mailContent
    };
    
    // send mail with defined transport object
    gmailTransporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log('error occured while sedning');
             console.log(error);
             deferred.reject();
        }
        console.log('Message sent:');
        deferred.resolve();  // SUCCESS with message
    });

    return deferred.promise;
}

function sendMail(
    fromMailId, toPersonList, ccPersonList, mailSubject, mailContent
){
    console.log('in start of sendMail in service');
    var deferred = Q.defer();

    // create reusable transporter's object using the default SMTP transport
    var nihilentTransporter = getNihilentMailTransporter();

    var gmailTransporter = getGmailTransporter();

    var mailOptions = {
        from: fromMailId, // sender address
        to: toPersonList, // list of receivers
        cc: ccPersonList,
        subject: mailSubject, 
        html: mailContent
    };

    gmailTransporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log('error occured while sedning mail from sendMail in service : '+error);
             deferred.reject();
        }else{
            console.log('Message sent: successfully from sendMail in service');
            deferred.resolve();  // SUCCESS with message
        }
    });
    console.log('in start of sendMail in service');
    return deferred.promise;
}