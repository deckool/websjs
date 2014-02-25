var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server),
	mongoose = require('mongoose');
	
server.listen(3000);

mongoose.connect('mongodb://localhost/tracker', function(err){
	if(err){
		console.log(err);
	} else{
		console.log('Connected to mongodb!');
	}
});

var chatSchema = mongoose.Schema({
	nick: String,
	msg: String,
	created: {type: Date, default: Date.now}
});

//var Chat = mongoose.model('Message', chatSchema);

app.get('/', function(req, res){
	res.sendfile(__dirname + '/index.html');
});

io.sockets.on('connection', function(socket){
	socket.on('send message', function(data){

//		console.log(data);
//		var msg = data.hash;
//		console.log('after trimming message is: ' + msg);

//			var newMsg = new Chat({msg: msg, nick: socket.nickname});
//			newMsg.save(function(err){
//				if(err) throw err;
//				io.sockets.emit('new message', {msg: msg, nick: socket.nickname});
//			});
		io.sockets.emit('new message', data);
	});
});