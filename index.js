
//Load express and server
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

//Secure options
//Uncomment below for https secure setup
/*
const https = require('https');
const fs = require('fs');
const options = {
	key: fs.readFileSync('./server.key'),
	cert: fs.readFileSync('./server.cert')
};

let server = https.createServer(options, app);
*/

//Comment the line below if you are setting up https
const server = require('http').Server(app);

//Setup app to use public folder to serve static files 
app.use(express.static('public'));

//Activate socket server
let io = require('socket.io').listen(server);

//client list
let clients = {};

//Fires when a new socket io connection has been detected.
io.sockets.on( 'connection', socket => {

	//Save User
	clients[socket.id] = {
		id:socket.id,
		socket:socket	
	}
	
	//Add dispatchEvent to listeners
	socket.on( "dispatchEvent", data => {
		for( let i in clients ) {
			if( socket.id != i ) clients[i].socket.emit( "onEvent", data );
		}
	});
	
	//Fires when a client has disconnected
	socket.on( 'disconnect', () => {
		clients[socket.id] = undefined;
		delete clients[socket.id];
	});
});

//Start and listen on server
server.listen( port, () => console.log(`Listening on ${port}`) );
