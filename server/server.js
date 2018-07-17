﻿require('rootpath')();
var express = require('express');
var app = express();
var cors = require('cors');
var bodyParser = require('body-parser');
var expressJwt = require('express-jwt');
var config = require('config.json');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// use JWT auth to secure the api, the token can be passed in the authorization header or querystring
// app.use(expressJwt({
//     secret: config.secret,
//     getToken: function (req) {
//         if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
//             return req.headers.authorization.split(' ')[1];
//         } else if (req.query && req.query.token) {
//             return req.query.token;
//         }
//         return null;
//     }
// }).unless({ path: ['/users/authenticate', '/users/register', '/requests/create', '/requests/team'] }));

// routes
app.use('/users', require('./controllers/users.controller'));
app.use('/requests', require('./controllers/request.controller'));
app.use('/skillSets',require('./controllers/skillSets.controller'));
// error handler
// app.use(function (err, req, res, next) {
//     //res.header("Access-Control-Allow-Origin", "*")
//     //res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")  
//     if (err.name === 'UnauthorizedError') {
//         res.status(401).send('Invalid Token');
//     } else {
//         throw err;
//     }
// });

// start server
var port = process.env.NODE_ENV === 'production' ? 80 : 4000;
var server = app.listen(port, function () {
    console.log('Server listening on port ' + port);
});