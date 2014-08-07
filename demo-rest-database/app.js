//default Node modules
var http = require('http');

//Modules that need initialzation
var sqlite3 = require('sqlite3').verbose();
var express = require('express');
var users = require('./users');
var courses = require('./courses');
var scores = require('./scores');

//Initialization step
var app = express();
var db = new sqlite3.Database('db/courses.dat');

//don't forget to call your own init function below
users.init(app, db);
courses.init(app, db);
scores.init(app, db);

//Define actions -
var actions = [];
actions.push(users.getActions());
actions.push(courses.getActions());
actions.push(scores.getActions());

//Configure the app
app.set('port', process.env.PORT || 3000);
app.set('view engine', 'ejs');

app.get('/', function displayHome(req, res)
{
    var appParams = {};
    appParams.actions = actions;
    res.render('index', appParams);
});


//Create the web server, listen on the port specified above
http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port') + " - visit http://localhost:3000/");
});