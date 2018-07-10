var config = require('config.json');
var express = require('express');
var router = express.Router();
var requestService = require('services/request.service');

// routes
router.post('/create', createReq);
router.post('/update', updateReq);
router.put('/updateRequest', updateRequest);
router.get('/', getAllReq);
router.delete('/:_id', deleteReq);
router.get('/team/:_id', getTeamReq);
router.get('/associate/newrequests/:_id', getAssociateNerReq);
router.get('/associate/:_id', getAssociateAllRequest);
router.post('/sendMail', sendMail);
// router.get('/get');

module.exports = router;

function sendMail(req, res) {
    console.log('in sendMail function of RequestController Start ');
    requestService.sendMail(req.body)
        .then(function (emailRes) {
            console.log(emailRes);
            console.log('in sendMail function of RequestController End');
            res.json('success');
        })
        .catch(function (err) {
            console.log('in sendMail function of RequestController End with error');
            res.status(400).send(err);
        });
}

function createReq(req, res) {
    requestService.createReq(req.body)
        .then(function () {
            res.json('success');
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function updateRequest(req, res) {
    console.log('in updateRequest of controllet');
    requestService.updateRequest(req.body)
        .then(function () {
            res.json('success');
            
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function updateReq(req, res) {
    requestService.updateReq(req.body)
        .then(function () {
            res.json('success');
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getAllReq(req, res) {
    requestService.getAllReq()
        .then(function (users) {
            res.send(users);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function deleteReq(req, res) {
    requestService.deleteReq(req.params._id)
        .then(function () {
            res.json('success');
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getTeamReq(req, res) {
    requestService.getTeamReq(req.params._id)
        .then(function (requests) {
            res.send(requests);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getAssociateNerReq(req, res) {
    console.log('in getAssociateNerReq start');
    requestService.getAssociateNerReq(req.params._id)
        .then(function (requests) {
           // console.log(requests);
           console.log('in getAssociateNerReq end');
            res.send(requests);
        })
        .catch(function (err) {
            console.log('in getAssociateNerReq end with error');
            res.status(400).send(err);
        });
}

function getAssociateAllRequest(req, res) {
    requestService.getAssociateAllRequest(req.params._id)
        .then(function (requests) {
            res.send(requests);
        })
        .catch(function (err) {
            res.status(400).send(err);
        })

}