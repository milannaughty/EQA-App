var config = require('config.json');
var _ = require('lodash');
var nodemailer = require('nodemailer');
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

service.updateStatusOfRequest = updateStatusOfRequest;
module.exports = service;



function updateRequest(requestParam) {
    console.log('UpdateRequest service started');
    //console.log(requestParam);
    var deferred = Q.defer();
    var set = { 'status': requestParam.status, };

    if (requestParam.assignedDevPanelList)
        set["assignedDevPanelList"] = requestParam.assignedDevPanelList;
    if (requestParam.assignedQAPanelList)
        set["assignedQAPanelList"] = requestParam.assignedQAPanelList;

    db.request.update(
        { _id: mongo.helper.toObjectID(requestParam._id) },
        { $set: set },
        function (err, doc) {
            if (err) {
                console.log('error while updaing request');
                console.log(err);
                deferred.reject(err);
            }
            else {
                console.log('UpdateRequest service completed');
                deferred.resolve();
            }
        }
    );
    
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
    var query = { $or: [{ "assignedDevPanelList.id": _associateId }, { "assignedQAPanelList.id": _associateId }], $and: [{ "status": "PanelAssigned" }] };
    db.request.find(query).toArray(
        function (err, requests) {
            if (err) deferred.reject(err.name + ': ' + err.message);
            deferred.resolve(requests);
        });
    return deferred.promise;
}

function getAssociateAllRequest(_associateId) {
    var query = { $or: [{ "assignedDevPanelList.id": _associateId }, { "assignedQAPanelList.id": _associateId }] };
    var deferred = Q.defer();
    db.request.find(query).toArray(
        function (err, requests) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve(requests);
        });
    return deferred.promise;
}

function updateStatusOfRequest(reqParam) {
    console.log("UpdateStatusOfRequest method started");
    var deferred = Q.defer();
    var set = {
        "status": reqParam.status,
        "rejectReason": reqParam.rejectReason,
    };
    if (reqParam.assignedDevPanelList !== undefined) {
        set["assignedDevPanelList"] = null;
    }
    if (reqParam.assignedQAPanelList !== undefined) {
        set["assignedQAPanelList"] = null;
    }
    if (reqParam.CheckListDetails !== undefined) {
        set["CheckListDetails"] = reqParam.CheckListDetails;
    }

    db.request.update(
        { _id: mongo.helper.toObjectID(reqParam.requestId) },
        { $set: set },
        function (err, doc) {
            if (err) deferred.reject(err.name + ': ' + err.message);
            console.log('Err :' + JSON.stringify(err))
            console.log('doc :' + JSON.stringify(doc))
            deferred.resolve();
        });

    return deferred.promise;
}

