var config = require('config.json');
var _ = require('lodash');
var nodemailer= require('nodemailer');
var Q = require('q');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true });
db.bind('request');

var service = {};

service.createReq = createReq;
service.getAllReq = getAllReq;
service.deleteReq = deleteReq;
service.updateReq = updateReq;
service.getTeamReq = getTeamReq;
service.getAssociateNerReq = getAssociateNerReq;
service.getAssociateAllRequest = getAssociateAllRequest;
service.updateRequest = updateRequest;
service.sendMail = sendMail;
module.exports = service;

function sendMail(reqParam) {
    var deferred = Q.defer();

    console.log('Email Sending started.')
    // create reusable transporter object using the default SMTP transport
    var transporter = nodemailer.createTransport({
        host: '172.16.1.4', 
        secureConnection: true,
        transportProtocol:'smtp',
        port: 25,
        auth:false,
        tls:false
    });
    var mailOptions = {
        from: 'krishna.yaldi@nihilent.com', // sender address
        to: '"Krishna Yaldi" <krishnayaldi@gmail.com>', // list of receivers
        subject: 'Hello ✔', 
        text: 'Sending Email Using Node JS?', // plain text body
        html: '<b>Hello<br><br><br><p> This Mail is sended by using Node Js :)</b></p>'
    };
    
    // send mail with defined transport object
    transporter.sendMail(mailOptions, function (error, info) {
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

function updateRequest(requestParam) {
    console.log('in updateRequest service of Request Service:start');
    //console.log(requestParam);
    var deferred = Q.defer();
    var set = {
        'assignedDevPanelList': requestParam.assignedDevPanelList,
        'assignedQAPanelList': requestParam.assignedQAPanelList,
        'status': requestParam.status,
    };
    db.request.update(
        { _id: mongo.helper.toObjectID(requestParam._id) },
        { $set: set },
        function (err, doc) {
            if (err) { 
                console.log('error while updaing request'); 
                console.log(err); 
                deferred.reject(err); }
            else {
                console.log(doc);
                deferred.resolve();
            }
        }
    );
    console.log('in updateRequest service of Request Service:end');
    return deferred.promise;
}

function createReq(reqParam) {
    var deferred = Q.defer();

    db.request.insert(
        reqParam,
        function (err, doc) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });

    return deferred.promise;
}

function updateReq(reqParam) {
    var deferred = Q.defer();

    // fields to update
    console.log(reqParam);
    var set = reqParam;
    db.users.update(
        { _id: mongo.helper.toObjectID(reqParam._id) },
        { $set: set },
        function (err, doc) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });

    return deferred.promise;
}

function getAllReq() {
    var deferred = Q.defer();

    db.request.find().toArray(function (err, requests) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        deferred.resolve(requests);
    });

    return deferred.promise;
}

function deleteReq(_id) {
    var deferred = Q.defer();

    db.request.remove(
        { _id: mongo.helper.toObjectID(_id) },
        function (err) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });

    return deferred.promise;
}

function getTeamReq(_id) {
    var deferred = Q.defer();
    db.request.find({ 'initiatedBy.ID': _id }).toArray(
        //{ _id: mongo.helper.toObjectID(_id) },
        function (err, requests) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve(requests);
        });
    return deferred.promise;
}

function getAssociateNerReq(_associateId) {
    var deferred = Q.defer();
    var query = { $or: [ { "assignedDevPanelList.id": _associateId }, { "assignedQAPanelList.id": _associateId } ] ,$and: [{"status":"PanelAssigned"}]};
    db.request.find(query).toArray(
        function (err, requests) {
            if (err) deferred.reject(err.name + ': ' + err.message);
            deferred.resolve(requests);
        });
    return deferred.promise;
}

function getAssociateAllRequest(_associateId) {
    var query = { $or: [ { "assignedDevPanelList.id": _associateId }, { "assignedQAPanelList.id": _associateId } ] };
    var deferred = Q.defer();
    db.request.find(query).toArray(
        function (err, requests) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve(requests);
        });
    return deferred.promise;
}