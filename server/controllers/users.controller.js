var config = require('config.json');
var express = require('express');
var router = express.Router();
var userService = require('services/user.service');

// routes
router.post('/authenticate', authenticate);
router.post('/register', register);
router.get('/', getAll);
router.get('/current', getCurrent);
router.put('/:_id', update);
router.delete('/:_id', _delete);
router.post('/getPanelBySkills', getPanelBySkills);
router.get('/getUsersByRole', getUsersByRole);
router.post('/resetUserPassword', resetUserPassword);

module.exports = router;

function authenticate(req, res) {
    userService.authenticate(req.body.username, req.body.password, req.body.isPanel)
        .then(function (user) {
            if (user) {
                // authentication successful
                console.log(user);
                res.send(user);
            } else {
                // authentication failed
                res.status(400).send('Username or password is incorrect');
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function register(req, res) {
    userService.create(req.body)
        .then(function () {
            res.json('success');
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getAll(req, res) {
    userService.getAll()
        .then(function (users) {
            res.send(users);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getCurrent(req, res) {
    userService.getById(req.user.sub)
        .then(function (user) {
            if (user) {
                res.send(user);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function update(req, res) {
    userService.update(req.params._id, req.body)
        .then(function () {
            res.json('success');
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function _delete(req, res) {
    userService.delete(req.params._id)
        .then(function () {
            res.json('success');
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getPanelBySkills(req, res) {
    console.log('Server : In getPanelBySkills service');
    userService.getPanelBySkills(req.body)
        .then(function (panelList) {
            res.json(panelList);
            console.log('Server : In getPanelBySkills service completed');
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getUsersByRole(req, res) {
    console.log('Server : In getUsersByRole controller');
    console.log(req.query);
    if(!req.query.hasOwnProperty("roleName")){
        response.status(400).send("Please use appropriate query parameter to fetch users by role");
    }else{
        userService.getUsersByRole(req.query.roleName)
        .then(function (userList) {
            res.json(userList);
            console.log('Server : In getUsersByRole service completed');
        })
        .catch(function (err) {
            console.log('Server : In getUsersByRole service completed with error '+JSON.stringify(err));
            res.status(400).send(err);
        });
    }
}


function resetUserPassword(req, res) {
    console.log('Server : In resetUserPassword controller');
    console.log(req.body);

    if(!req.body.hasOwnProperty("username")){
        response.status(400).send("Please use appropriate query parameter to change password");
    }else if(!req.body.hasOwnProperty("oldPassword")){
        response.status(400).send("Please use appropriate query parameter to change password");
    }else if(!req.body.hasOwnProperty("newPassword")){
        response.status(400).send("Please use appropriate query parameter to change password");
    }else{

        var uname=req.body.username;
        var oldPassword=req.body.oldPassword;
        var newPassword=req.body.newPassword;

        userService.resetUserPassword(uname,oldPassword,newPassword)
        .then(function (userList) {
            res.json(userList);
            console.log('Server : In resetUserPassword service completed');
        })
        .catch(function (err) {
            console.log('Server : In resetUserPassword service completed with error '+JSON.stringify(err));
            res.status(400).send(err);
        });
    }
}