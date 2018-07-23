//config properties can be pulled with config object
var config = require('config.json');
//express package provides server support and it also provides us routers to expose services
var express = require('express');
//Routers are used expose services
var router = express.Router();

var testServ = require('../services/testService.service2');

//below are routes
router.get('/getTestText', testServiceControllerMethod);
router.post('/postTestText', testServiceInsertMethod);

module.exports = router;

function testServiceControllerMethod(request, response) {
    console.log("sddfgas");
    console.log(request.query)
    testServ.getTestText(request.query)
        .then(function (data) {
            console.log(data);
            response.send(data);
        })
        .catch(function (err) {
            response.status(400).send(err);
        });
}

function testServiceInsertMethod(request, response) {
    console.log("sddfgas");
    console.log(request.query)
    testServ.testServiceInsertMethod(request.body)
        .then(function (data) {
            console.log(data);
            response.send(data);
        })
        .catch(function (err) {
            response.status(400).send(err);
        });
}