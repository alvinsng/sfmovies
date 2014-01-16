var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app);
var io = require('socket.io');
var sfmovies = require('./modules/sfmovies.js');

sfmovies.init(function(rows) {
	console.log('Loaded data ' + rows.length);
	io = io.listen(server, { log: false});
	server.listen(3000);

	app.use('/', express.static(__dirname + '/static'));
	app.use(express.errorHandler());

	io.sockets.on('connection', function(socket) {
		socket.emit('init', rows);
	});
});
