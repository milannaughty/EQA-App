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
service.getAssociateNewReq = getAssociateNewReq;
service.getAssociateAllRequest = getAssociateAllRequest;
service.updateRequest = updateRequest;

service.updateStatusOfRequest = updateStatusOfRequest;
service.getPanelRequestWithStatus = getPanelRequestWithStatus;
service.GetPanelRequestCountWithStatus = GetPanelRequestCountWithStatus;
service.GetAllPanelRequestCountWithStatus = GetAllPanelRequestCountWithStatus;
module.exports = service;



function updateRequest(requestParam) {
    console.log('UpdateRequest service started...');
    console.log(requestParam);
    var requestID = requestParam._id;
    delete requestParam._id;
    var deferred = Q.defer();
    // var set = { 'status': requestParam.status, };

    // if (requestParam.assignedDevPanelList)
    //     set["assignedDevPanelList"] = requestParam.assignedDevPanelList;
    // if (requestParam.assignedQAPanelList)
    //     set["assignedQAPanelList"] = requestParam.assignedQAPanelList;

    db.request.update(
        { _id: mongo.helper.toObjectID(requestID) },
        { $set: requestParam },
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

    db.request.find().sort({ creationDate: -1 }).toArray(function (err, requests) {
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

function getAssociateNewReq(_associateId) {
    var deferred = Q.defer();
    //var query = { $or: [{ "assignedDevPanelList.id": _associateId }, { "assignedQAPanelList.id": _associateId }], $and: [{ $or: [{ "assignedDevPanelList.status": 'PanelAssigned' }, { "assignedQAPanelList.status": 'PanelAssigned' }] }] };
    var query = {
        $or: [{ "assignedDevPanelList": { $elemMatch: { "id": _associateId, "status": "PanelAssigned" } } },
        { "assignedQAPanelList": { $elemMatch: { "id": _associateId, "status": "PanelAssigned" } } }]
    }
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

function getPanelRequestWithStatus(_associateId, _requestStatus) {
    var query = { $or: [{ "assignedDevPanelList.id": _associateId }, { "assignedQAPanelList.id": _associateId }], $and: [{ "status": _requestStatus }] };
    var deferred = Q.defer();
    db.request.find(query).toArray(
        function (err, requests) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve(requests);
        });
    return deferred.promise;
}

//Deprec
function getPanelRequestCountWithStatus(_associateId, _requestStatus) {
    console.log("in start of getPanelRequestCountWithStatus at Service");
    var query = {
        $or: [
            { "assignedDevPanelList.id": _associateId }
            , { "assignedQAPanelList.id": _associateId }
        ], "status": _requestStatus
    };
    console.log(query);
    //             query = { $or: 
    // [{ "assignedDevPanelList.id": "5b5576a589df945d682bc1b3" },
    //  { "assignedQAPanelList.id": "5b5576a589df945d682bc1b3" }]
    //  , "status": "PanelAssigned" };

    var deferred = Q.defer();
    db.request.count(query,
        function (err, doc) {
            console.log("in count");
            if (err) deferred.reject(err.name + ': ' + err.message);
            console.log('Err :' + JSON.stringify(err))
            console.log('doc :' + JSON.stringify(doc))
            deferred.resolve(doc);
        })

    return deferred.promise;
}

function GetPanelRequestCountWithStatus(panelID, panelType) {
    var deferred = Q.defer();

    var match;
    var groupID;
    var project;
    var unwind;
    console.log('Check one')
    if (panelType == 'Dev') {
        unwind = { "path": "$assignedDevPanelList" }
        match = { "assignedDevPanelList.id": panelID }
        groupID = { "status": "$assignedDevPanelList.status" }
        // groupID = "$assignedDevPanelList.status" 

    }
    else {
        unwind = { "path": "$assignedQAPanelList" }
        match = { "assignedQAPanelList.id": panelID }
        groupID = { "status": "$assignedQAPanelList.status" }
        //groupID =  "$assignedQAPanelList.status" 
    }
    var collection = db.collection("request");
    var options = { allowDiskUse: true };
    var pipeline = [
        { $unwind: unwind },
        { $match: match },
        { $group: { "_id": groupID, "count": { "$sum": 1 } } },
        {
            "$group": {
                "_id": 0,
                "data": { "$push": { "status": "$_id.status", "count": "$count" } }
            }
        }
    ];
    //console.log('Pipeline :')
    //console.log(JSON.stringify(pipeline));
    collection.aggregate(pipeline,
        function (err, results) {
            if (err) {
                deferred.reject(err)
            }
            else {
                if (results.length)
                    deferred.resolve(results[0].data);
                else
                    deferred.resolve([]);

            }
        })

    return deferred.promise;
}

function GetAllPanelRequestCountWithStatus(year, month) {
    console.log('Fetching qa panel summary record...')
    var deferred = Q.defer();
    var showYearMonthwise, showYearwise, showMonthwise, showAll;
    showYearMonthwise = year && month;
    showYearwise = year && !(month);
    showMonthwise = !(year) && month;
    showAll = !(year && month);

    // to acheive equality 01 == 1
    var monthString = '' + month;
    month = monthString.length == 1 ? '0' + month : month;

    var collection = db.collection("request");

    var options = { allowDiskUse: false };


    //TODO:: need to optimize this code
    var pipeline = [
        {
            $unwind: { "path": "$assignedQAPanelList" }
        },
        {
            $group: {
                _id: { "status": "$assignedQAPanelList.status", "name": "$assignedQAPanelList.itemName" },
                count: { "$sum": 1.0 }
            }
        },
        {
            $group: {
                _id: { "name": "$_id.name", "type": "QA" },
                data: {
                    $push: { "status": "$_id.status", "count": "$count" }
                }
            }
        }
    ];

    var initialPipeline = [];
    if (showYearMonthwise) {
        var project = {
            $project: {
                yearDate: { "$substr": ["$creationDate", 0, 4] },
                monthDate: { "$substr": ["$creationDate", 5, 2] },
                assignedQAPanelList: "$assignedQAPanelList"
            }
        }
        console.log("Year :"+year +" Month :"+month)        
        var match = { $match: { yearDate: { "$eq": year }, monthDate: { "$eq": month } } }

        initialPipeline.push(project);
        initialPipeline.push(match);
        pipeline = initialPipeline.concat(pipeline);
    }
    else if (showYearwise) {

        var project = {
            $project: {
                yearDate: { "$substr": ["$creationDate", 0, 4] },
                assignedQAPanelList: "$assignedQAPanelList"
            }
        }
        var match = { $match: { yearDate: { "$eq": year } } }

        initialPipeline.push(project);
        initialPipeline.push(match);
        pipeline = initialPipeline.concat(pipeline);
    }


    collection.aggregate(pipeline,
        function (err, results) {
            if (err) {
                deferred.reject(err)
            }
            else {
                console.log('Fetching QA panel summary record completed.')
                GetAllDevPanelRequestCountWithStatus(year, month).then(function (res, err) {
                    results = results.concat(res);
                    var data = results.map((x) => {
                        var y = {};
                        y.name = x._id.name;
                        y.type = x._id.type;
                        y.totalCount = 0;
                        y.statusData = {};
                        x.data.map((status) => {
                            y.statusData[status.status] = status.count;
                            y.totalCount += status.count;
                        })
                        return y;
                    })
                    data = data.sort((x, y) => { return y.totalCount - x.totalCount });
                    deferred.resolve(data);
                })
            }
        })

    return deferred.promise;
}

function GetAllDevPanelRequestCountWithStatus(year, month) {
    console.log('Fetching dev panel summary record...')
    var deferred = Q.defer();
    var showYearMonthwise, showYearwise, showMonthwise, showAll;
    showYearMonthwise = year && month;
    showYearwise = year && !(month);
    showMonthwise = !(year) && month;
    showAll = !(year && month);


    var collection = db.collection("request");

    var options = { allowDiskUse: false };


    //TODO:: need to optimize this code
    var pipeline = [
        {
            $unwind: { "path": "$assignedDevPanelList" }
        },
        {
            $group: {
                _id: { "status": "$assignedDevPanelList.status", "name": "$assignedDevPanelList.itemName" },
                count: { "$sum": 1.0 }
            }
        },
        {
            $group: {
                _id: { "name": "$_id.name", "type": "Dev" },
                data: {
                    $push: { "status": "$_id.status", "count": "$count" }
                }
            }
        }
    ];

    var initialPipeline = [];
    if (showYearMonthwise) {
        var project = {
            $project: {
                yearDate: { "$substr": ["$creationDate", 0, 4] },
                monthDate: { "$substr": ["$creationDate", 5, 2] },
                assignedDevPanelList: "$assignedDevPanelList"
            }
        }
        var match = { $match: { yearDate: { "$eq": year }, monthDate: { "$eq": month } } }

        initialPipeline.push(project);
        initialPipeline.push(match);
        pipeline = initialPipeline.concat(pipeline);
    }
    else if (showYearwise) {

        var project = {
            $project: {
                yearDate: { "$substr": ["$creationDate", 0, 4] },
                assignedDevPanelList: "$assignedDevPanelList"
            }
        }
        var match = { $match: { yearDate: { "$eq": year } } }

        initialPipeline.push(project);
        initialPipeline.push(match);
        pipeline = initialPipeline.concat(pipeline);
    }


    collection.aggregate(pipeline,
        function (err, results) {
            if (err) {
                deferred.reject(err)
            }
            else {
                console.log('Fetching dev panel summary record completed.')
                deferred.resolve(results);
            }
        })

    return deferred.promise;
}


function updateStatusOfRequest(reqParam) {
    console.log("UpdateStatusOfRequest method started");
    var utility = require('./utililties.service');
    var deferred = Q.defer();
    // var set = {
    //     "status": reqParam.status,
    //     "rejectReason": reqParam.rejectReason,
    // };
    // if (reqParam.assignedDevPanelList !== undefined) {
    //     set["assignedDevPanelList"] = null;
    // }
    // if (reqParam.assignedQAPanelList !== undefined) {
    //     set["assignedQAPanelList"] = null;
    // }
    // if (reqParam.CheckListDetails !== undefined) {
    //     set["CheckListDetails"] = reqParam.CheckListDetails;
    // }
    // if (!utility.IsUndefined(reqParam.DevReviewComment)) {
    //     set["DevReviewComment"] = reqParam.DevReviewComment;
    // }
    // if (!utility.IsUndefined(reqParam.QAReviewComment)) {
    //     set["QAReviewComment"] = reqParam.QAReviewComment;
    // }
    // if (!utility.IsUndefined(reqParam.verificationStatus)) {
    //     set["verificationStatus"] = reqParam.verificationStatus;
    // }
    //STRICT CHECKING REQUIRED HERE
    // if (reqParam.isDevPanel == true) {
    //     set["assignedDevPanelList"] = reqParam["assignedDevPanelList"];
    // }
    // if (reqParam.isDevPanel == false) {
    //     set["assignedQAPanelList"] = reqParam["assignedQAPanelList"];
    // }
    var requestID = reqParam._id;
    delete reqParam._id;
    console.log('Before Updating the request id:' + requestID)
    console.log(reqParam);
    db.request.update(
        { _id: mongo.helper.toObjectID(requestID) },
        { $set: reqParam },
        function (err, doc) {
            if (err) deferred.reject(err.name + ': ' + err.message);
            console.log('Err :' + JSON.stringify(err))
            console.log('doc :' + JSON.stringify(doc))
            deferred.resolve();
        });

    return deferred.promise;
}



