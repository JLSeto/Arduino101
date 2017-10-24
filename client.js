var io = require('socket.io-client')
var socket = io.connect('http://localhost:8000', {reconnect: true});

socket.on('connect', function() {
  console.log('Connected to server');
  socket.emit('chat message', 'hello');
});
