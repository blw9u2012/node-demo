var express = require('express');
var socketio = require('socket.io');
var bodyParser = require('body-parser');
var logger = require('./lib/logger');

var app = express();

app.use(logger);
app.use(bodyParser.json());

app.use(express.static('public'));

var voters = new Array();

// Establish some authentication..
app.use(function(req, res, next){
	if(req.method == "PUT"){
		console.log("PUT request recieved from " + req.connection.remoteAddress);
		
		if(voters[req.connection.remoteAddress] != null){
			if(voters[req.connection.remoteAddress].count == 1){
				res.end("You already voted");
				console.log("Voter already voted");
				return;
			}
			console.log(voters[req.connection.remoteAddress]);
		}
		else{
			voters[req.connection.remoteAddress] = {
				"ip": req.connection.remoteAddress,
				"count": 1
			};
			console.log("Voter with ip address: " + req.connection.remoteAddress + " created");
		}
	}
	next();
});

app.get('/poll/:id', function(req, res) {
	res.sendfile(__dirname + '/public/poll.html');
});


var server = app.listen(process.env.PORT || 3000, function() {
	console.log ("Server started at %d", server.address().port);
});


var io = socketio.listen(server);
io.on('connection', function(socket){

	console.log('client connected');
	socket.broadcast.emit('server ready', { 'okay' : 'ready' });

});

var pollsApi = require('./lib/polls')(io);

// API
app.post('/api/poll', pollsApi.createPoll);
app.get('/api/polls', pollsApi.listPolls);
app.get('/api/poll/:id', pollsApi.getPoll);
app.put('/api/poll/:id', pollsApi.updatePoll);
