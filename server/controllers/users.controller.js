var config = require('config.json');
var express = require('express');
var router = express.Router();
var userService = require('services/user.service');
var utililtiesServiceObject = require('services/utililties.service');

// routes
router.post('/authenticate', authenticate);
router.post('/register', register);
router.post('/submitfeedback', submitfeedback);
router.get('/', getAll);
router.get('/current', getCurrent);
router.put('/:_id', update);
router.delete('/:_id', _delete);
router.post('/getPanelBySkills', getPanelBySkills);
router.get('/getUsersByRole', getUsersByRole);
router.post('/resetUserPassword', resetUserPassword);
router.post('/forgotPassword', forgotPassword);
router.get('/generateRandomPassword', generateRandomPassword);
router.get('/getUserByUserName', getUserByUserName);
router.get('/:_id', getById);
router.post('/updatePanelStatus',updatePanelStatus);
router.post('/updateTeamStatus',updateTeamStatus);
router.post('/panelSoftDelete',panelSoftDelete);
router.post('/teamSoftDelete',teamSoftDelete);
module.exports = router;

function getUserByUserName(req,res){
    console.log("In generateRandomPassword of user controller");
    if(req.query.userName==undefined){
        res.status(400).send("Please use appropriate key");
    }
    userService.getUserByUserName(req.query.userName)
        .then(function (users) {
            console.log("In generateRandomPassword of user controller");
            res.send(users);
        })
        .catch(function (err) {
            console.log("In generateRandomPassword of user controller");
            res.status(400).send(err);
        });
}

function generateRandomPassword(req, res) {
    console.log("In generateRandomPassword of user controller");
    utililtiesServiceObject.generateRandomPassword()
    .then(function (res) {
        res.json(res);
    })
    .catch(function (err) {
        res.status(400).send(err);
    });
        res.send(utililtiesServiceObject.generateRandomPassword());
    }

    

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

function submitfeedback(req, res) {
    userService.submitfeedback(req.body)
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
    console.log("in update users controller"+ JSON.stringify(req.params));
    userService.update(req.params._id, req.body)
        .then(function () {
            res.json('success');
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function updatePanelStatus(req,res){
    console.log("In start of updatePanelStatusInController method" );
    bodyObject=req.body;
    if(bodyObject.panelId==null || bodyObject.panelId==undefined)
        {
            console.log("panelId is undefined");
            res.status(400).send("PanelId is Undefined");
            console.log("panelId is undefined");
        }
        else{
    console.log(bodyObject);
    userService.updatePanelStatus(bodyObject).then(
            function(element){
                console.log("updating Panel complete successfully");
                res.status(200).send(element);
            }
        ).catch(function(err){
            console.log("updating Panel complete successfully");
            res.status(400).send(err);
        })
    }
}
function panelSoftDelete(req,res){
    console.log("In start of panelSoftDeleteInController method" );
    bodyObject=req.body;
    console.log(bodyObject.panelId);
    if(bodyObject.panelId==null || bodyObject.panelId==undefined)
        {
            console.log("panelId is undefined");
            res.status(400).send("PanelId is Undefined");
        }else if(bodyObject.isDeleted==null || bodyObject.isDeleted==undefined)
        {
            console.log("isDeleted is undefined");
            res.status(400).send("iaDeleted is Undefined");
        }else{
    console.log(bodyObject);
    userService.panelSoftDelete(bodyObject).then(
            function(element){
                console.log("deleting Panel complete successfully");
                res.status(200).send(element);
            }
        ).catch(function(err){
            console.log("deleting Panel complete successfully");
            res.status(400).send(err);
        })
    }
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

function getById(req, res) {
    console.log("In start of User COntroller GetBYID method");
    userService.getById(req.params._id)
        .then(function (user) {
            res.send(user);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getPanelBySkills(req, res) {
    console.log('Server : In getPanelBySkills service');
    userService.getPanelBySkills(req.body)
        .then(function (panelList) {
            res.send(panelList);
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
        res.status(400).send("Please use appropriate query parameter to fetch users by role");
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
    //console.log(req.body);

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

function forgotPassword(req, res) {
    console.log('Server : In forgotPassword controller');
    console.log(req.body);
    if(!req.body.hasOwnProperty("username")){
        response.status(400).send("Please use appropriate query parameter to change password");
    }else{

        var uname=req.body.username;
        var password=req.body.newPassword;
        
        userService.generateNewPasswordIfForgotPassword(uname,password)
        .then(function (userList) {
            res.json(userList);
            console.log('Server : In forgotPassword service completed');
        })
        .catch(function (err) {
            console.log('Server : In forgotPassword service completed with error '+JSON.stringify(err));
            res.status(400).send(err);
        });
    }
    
}

function updateTeamStatus(req,res){
    console.log("In start of updateTeamStatusInController method" );
    bodyObject=req.body;
    if(bodyObject.teamId==null || bodyObject.teamId==undefined)
        {
            console.log("teamId is undefined");
            res.status(400).send("teamId is Undefined");
            console.log("teamId is undefined");
        }
        else{
    console.log(bodyObject);
    userService.updateTeamStatus(bodyObject).then(
            function(element){
                console.log("updating Team complete successfully");
                res.status(200).send(element);
            }
        ).catch(function(err){
            console.log("updating Team complete successfully");
            res.status(400).send(err);
        })
    }
}


function teamSoftDelete(req,res){
    console.log("In start of TeamSoftDeleteInController method" );
    bodyObject=req.body;
    console.log(bodyObject.teamId);
    if(bodyObject.teamId==null || bodyObject.teamId==undefined)
        {
            console.log("teamId is undefined");
            res.status(400).send("teamId is Undefined");
        }else if(bodyObject.isDeleted==null || bodyObject.isDeleted==undefined)
        {
            console.log("isDeleted is undefined");
            res.status(400).send("iaDeleted is Undefined");
        }else{
    console.log(bodyObject);
    userService.teamSoftDelete(bodyObject).then(
            function(element){
                console.log("deleting Team complete successfully");
                res.status(200).send(element);
            }
        ).catch(function(err){
            console.log("deleting Team complete successfully");
            res.status(400).send(err);
        })
    }
}