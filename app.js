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
	subid: String,
	created: {type: Date, default: Date.now}
});

var Chat = mongoose.model('Message', chatSchema);

app.get('/', function(req, res){
	res.sendfile(__dirname + '/index.html');
});

io.sockets.on('connection', function(socket){

	Chat.count(function(err, c){
		io.sockets.emit('last count', c);
	});

	socket.on('send message', function(data){

		var subid = data.hash;

			var newMsg = new Chat({subid: subid});
			newMsg.save(function(err){
				if(err) throw err;
				Chat.count(function(err, c){
					io.sockets.emit('new message', c);
 				 });
			});
	});
});