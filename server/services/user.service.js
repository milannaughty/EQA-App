var config = require('config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true });
db.bind('users');

var service = {};

service.authenticate = authenticate;
service.getAll = getAll;
service.getById = getById;
service.create = create;
service.update = update;
service.delete = _delete;
service.getPanelBySkills = getPanelBySkills;
service.getUsersByRole=getUsersByRole;
service.resetUserPassword=resetUserPassword;
service.generateNewPasswordIfForgotPassword=generateNewPasswordIfForgotPassword;
service.getUserByUserName=getUserByUserName;
service.updatePanelStatus=updatePanelStatus;
service.panelSoftDelete=panelSoftDelete;

module.exports = service;

function getUserByUserName(userName){
    console.log("At begining of getUserByUserName of UserService");
    var deferred = Q.defer();
    db.users.findOne({ username: userName },
        function(err,user){
            if(err)
                deferred.reject("Error : User not found with username "+userName);
            else
                deferred.resolve(user);
        });
    console.log("At end of getUserByUserName of UserService");
    return deferred.promise;
}

function generateNewPasswordIfForgotPassword(username,newPassword){
    console.log("At begining of resetPassword of UserService");
    var deferred = Q.defer();
    db.users.findOne({ username: username },
        function(err,user){
            if(err)
                deferred.reject(err.name + ': ' + err.message + "No user with username : "+username+" found");
            else{
                updateUser(user._id,newPassword);
                deferred.resolve("success : Password updated successfully. New password emailed to respective user.");
            }
        });

        function updateUser(_id,newPassword) {
            console.log("At begining of inner updateUser function of resetPassword of UserService");
            // fields to update
            var set = {
                    hash:bcrypt.hashSync(newPassword, 10)
            };
            
            db.users.update(
                { _id: mongo.helper.toObjectID(_id) },
                { $set: set },
                function (err, doc) {
                    if (err) 
                        deferred.reject(err.name + ': ' + err.message+" Error while updating password");
                    deferred.resolve("Password changed successfully");
                });
            console.log("At end of inner updateUser function of resetPassword of UserService");
        }
        
    return deferred.promise;    
}

function resetUserPassword(username,oldPassword,newPassword){
    console.log("At begining of resetPassword of UserService");
    var deferred = Q.defer();
    db.users.findOne({ username: username }, function (err, user) {
        if (err) 
            deferred.reject(err.name + ': ' + err.message + "No user with username : "+username+" found");

        if (user && bcrypt.compareSync(oldPassword, user.hash)) {
            //old password matched
            console.log("resetPassword of UserService : password matched");
            updateUser(user._id,newPassword);
        }else{
            //old password doesn't matched
            console.log("resetPassword of UserService : password mismatch");
            deferred.reject("old password didn't match");
        }
    }); 

    function updateUser(_id,newPassword) {
        console.log("At begining of inner updateUser function of resetPassword of UserService");
        // fields to update
        var set = {
                hash:bcrypt.hashSync(newPassword, 10)
        };
        
        db.users.update(
            { _id: mongo.helper.toObjectID(_id) },
            { $set: set },
            function (err, doc) {
                if (err) 
                    deferred.reject(err.name + ': ' + err.message+" Error while updating password");
                deferred.resolve("Password changed successfully");
            });
        console.log("At end of inner updateUser function of resetPassword of UserService");
    }
    console.log("At end of resetPassword of UserService");
    return deferred.promise;   
}

function updatePanelStatus(reqBody) {
    console.log("updatePanelStatus method started for checking similar");
    var deferred = Q.defer();
    console.log("updatePanelStatus method started");
    var set = {
        "obsolute": reqBody.obsolute,
    };
    console.log(reqBody);
    console.log(reqBody.panelId);
    db.users.update(
        { _id: mongo.helper.toObjectID(reqBody.panelId) },
        { $set: set },
        function (err, doc) {
            if (err) deferred.reject(err.name + ': ' + err.message);
            console.log('Err :' + JSON.stringify(err))
            console.log('doc :' + JSON.stringify(doc))
            deferred.resolve();
        });
    return deferred.promise;
}
function panelSoftDelete(reqBody) {
    console.log("panelSoftDelete method started for checking similar");
    var deferred = Q.defer();
    console.log("panelSoftDelete method started");
    var set = {
        "isDeleted": reqBody.isDeleted,
    };
    console.log(reqBody);
    console.log(reqBody.panelId);
    db.users.update(
        { _id: mongo.helper.toObjectID(reqBody.panelId) },
        { $set: set },
        function (err, doc) {
            if (err) deferred.reject(err.name + ': ' + err.message);
            console.log('Err :' + JSON.stringify(err))
            console.log('doc :' + JSON.stringify(doc))
            deferred.resolve();
        });
    return deferred.promise;
}
function authenticate(username, password, isPanel) {
    var deferred = Q.defer();
    db.users.findOne({ username: username }, function (err, user) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (user && bcrypt.compareSync(password, user.hash)) {
            console.log(user);
            // authentication successful
            console.log(isPanel);
            console.log(user.isPanel);
            if (isPanel == user.isPanel) {

                deferred.resolve({
                    _id: user._id,
                    username: user.username,
                    FName: user.FName,
                    LName: user.LName,
                    isPanel: user.isPanel,
                    isAdmin: user.isAdmin,
                    teamName: user.teamName,
                    panelType: user.panelType,
                    PMEmail:user.PMEmail,
                    POCEmail:user.POCEmail,
                    DAMEmail:user.DAMEmail,
                    token: jwt.sign({ sub: user._id }, config.secret)
                });
            } else {
                deferred.reject("Incorrect role, please provide the valid credentials");
            }
        } else {
            // authentication failed
            deferred.resolve();
        }
    });

    return deferred.promise;
}

function getAll() {
    var deferred = Q.defer();

    db.users.find().toArray(function (err, users) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        // return users (without hashed passwords)
        users = _.map(users, function (user) {
            return _.omit(user, 'hash');
        });

        deferred.resolve(users);
    });

    return deferred.promise;
}

function getById(_id) {
    console.log("in start of getById method of UserService");
    var deferred = Q.defer();

    db.users.findById(_id, function (err, user) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (user) {
            console.log("in end user found of getById method of UserService");
            // return user (without hashed password)
            deferred.resolve(_.omit(user, 'hash'));
        } else {
            // user not found
            console.log("in end not found of getById method of UserService");
            deferred.resolve();
        }
    });

    return deferred.promise;
}

function create(userParam) {
    var deferred = Q.defer();

    // validation
    db.users.findOne(
        { username: userParam.username },
        function (err, user) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            if (user) {
                // username already exists
                deferred.reject('Username "' + userParam.username + '" is already taken');
            } else {
                createUser();
            }
        });

    function createUser() {
        // set user object to userParam without the cleartext password
        var user = _.omit(userParam, 'password');

        // add hashed password to user object
        user.hash = bcrypt.hashSync(userParam.password, 10);

        db.users.insert(
            user,
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    }

    return deferred.promise;
}

function update(_id, userParam) {
    var deferred = Q.defer();

    // validation
    db.users.findById(_id, function (err, user) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (user.username !== userParam.username) {
            // username has changed so check if the new username is already taken
            db.users.findOne(
                { _id: _id },
                function (err, user) {
                    if (err) deferred.reject(err.name + ': ' + err.message);

                    if (user) {
                        // username already exists
                        deferred.reject('Username "' + userParam.username + '" is already taken')
                    } else {
                        updateUser();
                    }
                });
        } else {
            updateUser();
        }
    });

    function updateUser() {
        // fields to update
        var set = {
            firstName: userParam.firstName,
            lastName: userParam.lastName,
            username: userParam.username,
        };

        // update password if it was entered
        if (userParam.password) {
            set.hash = bcrypt.hashSync(userParam.password, 10);
        }

        db.users.update(
            { _id: mongo.helper.toObjectID(_id) },
            { $set: set },
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    }

    return deferred.promise;
}

function _delete(_id) {
    var deferred = Q.defer();

    db.users.remove(
        { _id: mongo.helper.toObjectID(_id) },
        function (err) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });

    return deferred.promise;
}

function getPanelBySkills(skills) {
    console.log("In getPanelBySkills :"+JSON.stringify(skills));
    var deferred = Q.defer();
    if (!(Array.isArray(skills.devSkillSet) && Array.isArray(skills.qaSkillSet) && (skills.devSkillSet.length > 0 || skills.qaSkillSet.length > 0))) {
        console.log("Returning : []");
        deferred.resolve([]);
    }
    else {
        
        db.users.find({ isPanel: true }).toArray(function (err, panel) {
            if (err) deferred.reject(err.name + ': ' + err.message);
            var result = []
            var requestedDevSkill = skills.devSkillSet.map(x => x.itemName);
            var requestedQaSkill = skills.qaSkillSet.map(x => x.itemName);
            panel.map(function (p) {
                console.log("---------------PANEL------------------");
                console.log(p.FName +' '+p.LName);
                var panelSkills = p.panelType =='QA'? p.qaSkillList.map(x => x.itemName):p.skillSet.map(x => x.itemName);
                var valid = panelSkills.some(x => (requestedDevSkill.includes(x) || requestedQaSkill.includes(x)))
                if (valid)
                    result.push(p)
            })
            deferred.resolve(result);
        });
    }

    return deferred.promise;
}

function getUsersByRole(roleName){
    console.log("in start of getUsersByRole in service");
    var deferred = Q.defer();
    var query;
    if(roleName=='admin'){
        query = {
            "$and": [
                {
                    "isAdmin": {
                        "$exists": true
                    }
                },
                {
                    "isAdmin": true
                }
            ]
        };
    }else if(roleName=='panel')   
            {
                query = {
                    "$and": [
                        {
                            "isPanel": {
                                "$exists": true
                            }
                        },
                        {
                            "isPanel": true
                        }
                    ]
                };
            }else if(roleName=='team'){
                    query = {
                        "$and": [
                            {
                                "isPanel": {
                                    "$exists": true
                                }
                            },
                            {
                                "isPanel": false
                            }
                        ]
                    };
                }else{
                    deferred.reject("No role found like "+roleName);
                    return deferred.promise;
                }  
              
                console.log(JSON.stringify(query));

    db.users.find(query).toArray(function (err, result) {
        if (err) {
            console.log("Error fetching Users for role "+roleName)
            deferred.reject(err.name + ': ' + err.message);
        }else{
            console.log("Users fetched for role "+roleName)
            deferred.resolve(result);
        }
    });
    console.log("At end of getUsersByRole in service");
    return deferred.promise;
}

