var config = require('config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var PropertiesReader = require('properties-reader');
var properties = PropertiesReader('C:/IQA-conf/iqa-conf.prop');

var utilitiesServiceObject = require('./utililties.service');

const AD = require('activedirectory2').promiseWrapper;
const adConfig = {
    url: properties.get('url'),
    baseDN: properties.get('baseDN'),
    username: properties.get('username'),
    password: properties.get('password')
}
const ad = new AD(adConfig);
var Q = require('q');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true });
db.bind('users');
db.bind('feedbacks');
var service = {};

service.authenticate = authenticate;
service.getAll = getAll;
service.getById = getById;
service.create = create;
service.update = update;
service.delete = _delete;
service.getPanelBySkills = getPanelBySkills;
service.getUsersByRole = getUsersByRole;
service.resetUserPassword = resetUserPassword;
service.generateNewPasswordIfForgotPassword = generateNewPasswordIfForgotPassword;
service.getUserByUserName = getUserByUserName;
service.updatePanelStatus = updatePanelStatus;
service.panelSoftDelete = panelSoftDelete;
service.updateTeamStatus = updateTeamStatus;
service.teamSoftDelete = teamSoftDelete;
service.submitfeedback = submitfeedback;

service.authenticateByLdap = authenticateByLdap;
service.findUserInLdapWithEmail = findUserInLdapWithEmail;
service.checkIfUserExistsInLdapWithEmail = checkIfUserExistsInLdapWithEmail;
service.authentionByBothLdapAndMongo = authentionByBothLdapAndMongo;
service.UpdateUserDetails = UpdateUserDetails;

module.exports = service;

/**
 * This method athenticates user of role Admin / Panel from LDAP 
 * And for team user it authenticates from MongoDB 
 * @param {username} username 
 * @param {password} password 
 */
function authentionByBothLdapAndMongo(username, password) {
    console.log('In start of authentionByBothLdapAndMongo of UserService');
    var deferred = Q.defer();

    if (username.indexOf('@nihilent.com') > -1) {//if user is IQA lead or panel authenticate with LDAP
        ad.authenticate(username, password, function (err, auth) {
            if (err) {
                var errorString = JSON.stringify(err);
              console.log('ERROR: '+errorString);
              console.log('In authentionByBothLdapAndMongo of UserService ends with err Error : ');
              return deferred.reject(' Invalid credentials, please try with valid credentials');
            }

            if (auth) {
                console.log('In authentionByBothLdapAndMongo of UserService LDAP authenticated');
                db.users.findOne({ username: username },
                    function (err, user) {
                        if (err) {
                            console.log('Error occured while looking for user in db after authentication');
                            console.log(JSON.stringify(err));
                            deferred.reject('Error while authentication, Kindly ask support team to look into logs');
                        } else if (user == null) {
                            //user not found in mongoDB, this is first login of user
                            //making users entry in MongoDB
                            console.log("User not found with username in MongoDB making entry with : " + username);

                            var query = 'mail=' + username;
                            ad.findUsers(query, true, function (err, users) {
                                //looking for user details in LDAP
                                if (err) {
                                    var errorString = JSON.stringify(err);
                                    console.log('In authentionByBothLdapAndMongo of UserService Error : user detail not found in LDAP with email : ' + username + ' ERROR: ' + errorString);
                                    deferred.reject(errorString);
                                } else if ((!users) || (users.length == 0)) {
                                    console.log('In end of authentionByBothLdapAndMongo of UserService ERROR: ' + 'No users found with email : ' + username);
                                    deferred.reject('No user found with email : ' + username);
                                } else {
                                    console.log('In end of findUserInLdapWithEmail of UserService user found with email : ' + username);
                                    //user detail found
                                    var userGroupArr = users[0].groups
                                    var tFirstName = utilitiesServiceObject.getFirstNameFromEmail(username);
                                    var tLastName = utilitiesServiceObject.getLastNameFromEmail(username);
                                    var newUserObject = {
                                        "FName": tFirstName,
                                        "username": username,
                                        "LName": tLastName,
                                        "panelType": null,
                                        "skillSet": null,
                                        "isPanel": false,
                                        "isAdmin": false,
                                        "AddedBy": {
                                            "AdminUser": username
                                        },
                                        "AddedOn": new Date(),
                                        "password": password
                                    };


                                    if (userGroupArr.some(x => x.cn == config.AdminDLName)) {//fill user details as admin
                                        newUserObject.isAdmin = true;
                                    } else {//fill user details as panel
                                        //newUserObject.panelType="Dev";
                                        newUserObject.isPanel = true;
                                    }
                                    createNewUser(newUserObject);
                                }
                            });
                        } else if (user) {
                            deferred.resolve({
                                _id: user._id,
                                username: user.username,
                                FName: user.FName,
                                LName: user.LName,
                                isPanel: user.isPanel,
                                isAdmin: user.isAdmin,
                                teamName: user.teamName,
                                panelType: user.panelType,
                                PMEmail: user.PMEmail,
                                POCEmail: user.POCEmail,
                                DAMEmail: user.DAMEmail,
                                token: jwt.sign({ sub: user._id }, config.secret)
                            });
                        } else {
                            deferred.reject('Error : Unexpected error occured');
                        }
                    });
            } else {
                console.log('In authentionByBothLdapAndMongo of UserService ends with err athentication failed');
                deferred.reject("Error : Authentication failed");
            }
        });
    } else {//if user is neither IQA lead nor panel authenticate with MONGO
        //authenticate(username,password,false);
        console.log('In authentionByBothLdapAndMongo of userService : MongoAuthentication for team');
        db.users.findOne({ username: username }, function (err, user) {
            if (err) {
                console.log('In authentionByBothLdapAndMongo of userService : MongoAuthentication for team - has error ' + JSON.stringify(err));
                deferred.reject(err.name + ': ' + err.message);
            }

            if (user && bcrypt.compareSync(password, user.hash)) {
                console.log(user);
                // authentication successful

                if (!user.isPanel) {

                    deferred.resolve({
                        _id: user._id,
                        username: user.username,
                        FName: user.FName,
                        LName: user.LName,
                        isPanel: user.isPanel,
                        isAdmin: user.isAdmin,
                        teamName: user.teamName,
                        panelType: user.panelType,
                        PMEmail: user.PMEmail,
                        POCEmail: user.POCEmail,
                        DAMEmail: user.DAMEmail,
                        token: jwt.sign({ sub: user._id }, config.secret)
                    });
                } else {
                    console.log('In authentionByBothLdapAndMongo of userService : MongoAuthentication for team - Incorrect role, please provide the valid credentials ');
                    deferred.reject("Incorrect role, please provide the valid credentials");
                }
            } else {
                // authentication failed
                console.log('In authentionByBothLdapAndMongo of userService : MongoAuthentication for team - Invalid Credentials');
                deferred.reject("Invalid Credentials - please provide the valid credentials");
            }
        });

    }

    function createNewUser(recievedUserObject) {
        console.log('In createNewUser of authentionByBothLdapAndMongo of UserService');
        // set user object to userParam without the cleartext password
        var user = _.omit(recievedUserObject, 'password');

        // add hashed password to user object
        user.hash = bcrypt.hashSync(recievedUserObject.password, 10);

        db.users.insert(
            user,
            function (err, doc) {
                if (err) {
                    console.log('In createNewUser of authentionByBothLdapAndMongo of UserService ends with error : ' + JSON.stringify(err));
                    deferred.reject(err.name + ': ' + err.message);
                }
                deferred.resolve({
                    _id: doc['insertedIds'][0],
                    username: recievedUserObject.username,
                    FName: recievedUserObject.FName,
                    LName: recievedUserObject.LName,
                    isPanel: recievedUserObject.isPanel,
                    isAdmin: recievedUserObject.isAdmin,
                    teamName: recievedUserObject.teamName,
                    panelType: recievedUserObject.panelType,
                    PMEmail: recievedUserObject.PMEmail,
                    POCEmail: recievedUserObject.POCEmail,
                    DAMEmail: recievedUserObject.DAMEmail,
                    token: jwt.sign({ sub: user._id }, config.secret)
                });
            });
    }
    return deferred.promise;
}


function authenticateByLdap(username, password) {
    console.log('In start of authenticateByLdap of UserService');
    var deferred = Q.defer();

    ad.authenticate(username, password, function (err, auth) {
        if (err) {
            console.log('ERROR: ' + JSON.stringify(err));
            console.log('In authenticateByLdap of UserService ends with err');
            return deferred.reject(JSON.stringify(err));
        }

        if (auth) {
            console.log('In authenticateByLdap of UserService ends with success');
            return deferred.resolve(auth);
        }
        else {
            console.log('In authenticateByLdap of UserService ends with err athentication failed');
            return deferred.reject("Error : athentication failed");
        }
    });
    return deferred.promise;
}

function findUserInLdapWithEmail(email) {
    console.log('In start of findUserInLdapWithEmail of UserService');
    var query = 'mail=' + email;
    var deferred = Q.defer();
    ad.findUsers(query, true, function (err, users) {
        if (err) {
            console.log('In end of findUserInLdapWithEmail of UserService with email : ' + email + ' ERROR: ' + JSON.stringify(err));
            deferred.reject(JSON.stringify(err));
        }

        if ((!users) || (users.length == 0)) {
            console.log('In end of findUserInLdapWithEmail of UserService ERROR: ' + 'No users found with email : ' + email);
            deferred.reject('No user found with email : ' + email);
        }

        else {
            console.log('In end of findUserInLdapWithEmail of UserService user found with email : ' + email);
            deferred.resolve(JSON.stringify(users));
        }
    });
    return deferred.promise;
}

function checkIfUserExistsInLdapWithEmail(email) {
    console.log('In start of checkIfUserExistsInLdapWithEmail of UserService');
    var deferred = Q.defer();
    ad.userExists(email, function (err, exists) {
        if (err) {
            console.log('In end of checkIfUserExistsInLdapWithEmail of UserService ERROR: ' + JSON.stringify(err));
            deferred.reject(JSON.stringify(err));
        }
        console.log('In end of checkIfUserExistsInLdapWithEmail of UserService email exists = ' + exists);
        deferred.resolve(exists);
    });
    return deferred.promise;
}
function getUserByUserName(userName) {
    console.log("At begining of getUserByUserName of UserService");
    var deferred = Q.defer();
    db.users.findOne({ username: userName },
        function (err, user) {
            if (err) {
                console.log('Error while looking for user with email ' + userName + ' Error : ' + JSON.stringify(user));
                deferred.reject("Error : User not found with username " + userName);
            } else {
                console.log('User found with email ' + JSON.stringify(user));
                deferred.resolve(user);
            }

        });
    console.log("At end of getUserByUserName of UserService");
    return deferred.promise;
}

function generateNewPasswordIfForgotPassword(username, newPassword) {
    console.log("At begining of resetPassword of UserService");
    var deferred = Q.defer();
    db.users.findOne({ username: username },
        function (err, user) {
            if (err)
                deferred.reject(err.name + ': ' + err.message + "No user with username : " + username + " found");
            else {
                updateUser(user._id, newPassword);
                deferred.resolve("success : Password updated successfully. New password emailed to respective user.");
            }
        });

    function updateUser(_id, newPassword) {
        console.log("At begining of inner updateUser function of resetPassword of UserService");
        // fields to update
        var set = {
            hash: bcrypt.hashSync(newPassword, 10)
        };

        db.users.update(
            { _id: mongo.helper.toObjectID(_id) },
            { $set: set },
            function (err, doc) {
                if (err)
                    deferred.reject(err.name + ': ' + err.message + " Error while updating password");
                deferred.resolve("Password changed successfully");
            });
        console.log("At end of inner updateUser function of resetPassword of UserService");
    }

    return deferred.promise;
}

function resetUserPassword(username, oldPassword, newPassword) {
    console.log("At begining of resetPassword of UserService");
    var deferred = Q.defer();
    db.users.findOne({ username: username }, function (err, user) {
        if (err)
            deferred.reject(err.name + ': ' + err.message + "No user with username : " + username + " found");

        if (user && bcrypt.compareSync(oldPassword, user.hash)) {
            //old password matched
            console.log("resetPassword of UserService : password matched");
            updateUser(user._id, newPassword);
        } else {
            //old password doesn't matched
            console.log("resetPassword of UserService : password mismatch");
            deferred.reject("old password didn't match");
        }
    });

    function updateUser(_id, newPassword) {
        console.log("At begining of inner updateUser function of resetPassword of UserService");
        // fields to update
        var set = {
            hash: bcrypt.hashSync(newPassword, 10)
        };

        db.users.update(
            { _id: mongo.helper.toObjectID(_id) },
            { $set: set },
            function (err, doc) {
                if (err)
                    deferred.reject(err.name + ': ' + err.message + " Error while updating password");
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



function updateTeamStatus(reqBody) {
    console.log("updateTeamStatus method started for checking similar");
    var deferred = Q.defer();
    console.log("updateTeamStatus method started");
    var set = {
        "obsolute": reqBody.obsolute,
    };
    console.log(reqBody);
    console.log(reqBody.teamId);
    db.users.update(
        { _id: mongo.helper.toObjectID(reqBody.teamId) },
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
                    PMEmail: user.PMEmail,
                    POCEmail: user.POCEmail,
                    DAMEmail: user.DAMEmail,
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
    console.log('in start of create method of user service');
    var deferred = Q.defer();

    // validation
    db.users.findOne(
        { username: userParam.username },
        function (err, user) {
            if (err) {
                console.log('create method of user service has error : ' + JSON.stringify(err));
                deferred.reject(err.name + ': ' + err.message);
            } else if (user) {
                // username already exists
                console.log('create method of user service has error : Username "' + userParam.username + '" is already taken');
                deferred.reject('Username "' + userParam.username + '" is already taken');
            } else {
                createUser();
            }
        });

    function createUser() {
        // set user object to userParam without the cleartext password
        console.log('createUser method of create method user service  ');
        var user = _.omit(userParam, 'password');

        // add hashed password to user object
        user.hash = bcrypt.hashSync(userParam.password, 10);

        db.users.insert(
            user,
            function (err, doc) {
                if (err) {
                    console.log('createUser method of create method user service has error : while inserting ' + JSON.stringify(err));
                    deferred.reject(err.name + ': ' + err.message);
                }
                deferred.resolve();
            });
    }

    return deferred.promise;
}
// service for user valuable feedback

function submitfeedback(userParam) {
    var deferred = Q.defer();
    db.feedbacks.insert(
        userParam,
        function (err, doc) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });


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

function UpdateUserDetails(_id, userParam) {
    var deferred = Q.defer();
    db.users.update(
        { _id: mongo.helper.toObjectID(_id) },
        { $set: userParam },
        function (err, doc) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });

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
    console.log("In getPanelBySkills :" + JSON.stringify(skills));
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
                console.log(p.FName + ' ' + p.LName);
                p.skillSet = p.skillSet || [];
                p.qaSkillList = p.qaSkillList || [];
                var panelSkills = p.panelType == 'QA' ? p.qaSkillList.map(x => x.itemName) : p.skillSet.map(x => x.itemName);
                var valid = panelSkills.some(x => (requestedDevSkill.includes(x) || requestedQaSkill.includes(x)))
                if (valid)
                    result.push(p)
            })
            deferred.resolve(result);
        });
    }

    return deferred.promise;
}

function getUsersByRole(roleName) {
    console.log("in start of getUsersByRole in service");
    var deferred = Q.defer();
    var query;
    if (roleName == 'admin') {
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
                            },
                            {
                                "isAdmin": {
                                    "$exists": false
                                }
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
            console.log("Error fetching Users for role " + roleName)
            deferred.reject(err.name + ': ' + err.message);
        } else {
            console.log("Users fetched for role " + roleName)
            deferred.resolve(result);
        }
    });
    console.log("At end of getUsersByRole in service");
    return deferred.promise;
}

function teamSoftDelete(reqBody) {
    console.log("teamSoftDelete method started for checking similar");
    var deferred = Q.defer();
    console.log("teamSoftDelete method started");
    var set = {
        "isDeleted": reqBody.isDeleted,
    };
    console.log(reqBody);
    console.log(reqBody.teamId);
    db.users.update(
        { _id: mongo.helper.toObjectID(reqBody.teamId) },
        { $set: set },
        function (err, doc) {
            if (err) deferred.reject(err.name + ': ' + err.message);
            console.log('Err :' + JSON.stringify(err))
            console.log('doc :' + JSON.stringify(doc))
            deferred.resolve();
        });
    return deferred.promise;
}