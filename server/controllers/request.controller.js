var config = require('config.json');
var express = require('express');
var router = express.Router();
var requestService = require('../services/request.service');

// routes
router.post('/create', createReq);
router.post('/update', updateReq);
router.put('/updateRequest', updateRequest);
router.get('/', getAllReq);
router.delete('/:_id', deleteReq);
router.get('/team/:_id', getTeamReq);
router.get('/associate/newrequests/:_id', getAssociateNewReq);
router.get('/associate/:_id', getAssociateAllRequest);
// router.post('/sendMail', sendMail);
router.put('/updateStatusOfRequest', updateStatusOfRequestInController);

router.get('/associate/request', getPanelRequestWithStatus);
router.get('/associate/requestcount/:panelID/:panelType', GetPanelRequestCountWithStatus);
router.get('/associate/all/requestcount/:year?/:month?', GetAllPanelRequestCountWithStatus);
// router.get('/get');

module.exports = router;

function updateStatusOfRequestInController(request, response) {
    console.log("In start of updateStatusOfRequestInController method");
    console.log(request.body);
    requestService.updateStatusOfRequest(request.body).then(
        function (element) {
            console.log("updating request complete successfully");
            response.status(200).send(element);
        }
    ).catch(function (err) {
        console.log("updating request complete successfully");
        response.status(400).send(err);
    })
}

// function sendMail(req, res) {
//     console.log('in sendMail function of RequestController Start ');
//     requestService.sendMail(req.body)
//         .then(function (emailRes) {
//             console.log(emailRes);
//             console.log('in sendMail function of RequestController End');
//             res.json('success');
//         })
//         .catch(function (err) {
//             console.log('in sendMail function of RequestController End with error');
//             res.status(400).send(err);
//         });
// }

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

function getAssociateNewReq(req, res) {
    console.log('in getAssociateNewReq start');
    requestService.getAssociateNewReq(req.params._id)
        .then(function (requests) {
            // console.log(requests);
            console.log('in getAssociateNewReq end');
            res.send(requests);
        })
        .catch(function (err) {
            console.log('in getAssociateNewReq end with error');
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

function getPanelRequestWithStatus(req, res) {
    console.log('GetPanelRequestWithStatus start');
    requestService.getPanelRequestWithStatus(req.params._associateId, req.params.requestStatus)
        .then(function (requests) {
            // console.log(requests);
            console.log('GetPanelRequestWithStatus end');
            res.send(requests);
        })
        .catch(function (err) {
            console.log('GetPanelRequestWithStatus end with error');
            res.status(400).send(err);
        });
}

/**
 * Method returns the panel along with the there request status count summary
 * 
 *  */
function GetPanelRequestCountWithStatus(req, res) {
    console.log('GetPanelRequestCountWithStatus start...');
    console.log('Panel : ' + JSON.stringify(req.params));
    requestService.GetPanelRequestCountWithStatus(req.params.panelID, req.params.panelType)
        .then(function (requests) {
            console.log('GetPanelRequestCountWithStatus Completed');
            res.send(requests);
        })
        .catch(function (err) {
            console.log('GetPanelRequestCountWithStatus end with error' + JSON.stringify(err));
            res.status(400).send(err);
        });
}

/**
 * Method returns the panel list along with the there request status count summary
 * 
 *  */
function GetAllPanelRequestCountWithStatus(req, res) {
    console.log('GetAllPanelRequestCountWithStatus start...');
    requestService.GetAllPanelRequestCountWithStatus(req.params.year, req.params.month)
        .then(function (requests) {
            console.log('GetAllPanelRequestCountWithStatus Completed');
            res.send(requests);
        })
        .catch(function (err) {
            console.log('GetAllPanelRequestCountWithStatus end with error' + JSON.stringify(err));
            res.status(400).send(err);
        });
}