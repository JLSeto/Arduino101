var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);


app.use(express.static(__dirname + '/public'));



io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('t', function(msg){
    socket.broadcast.emit('t',msg);
  });
  socket.on('ax', function(msg){
    socket.broadcast.emit('ax',msg);
  });
  socket.on('ay', function(msg){
    socket.broadcast.emit('ay',msg);
  });
  socket.on('az', function(msg){
    socket.broadcast.emit('az',msg);
  });
  socket.on('gx', function(msg){
    socket.broadcast.emit('gx',msg);
  });
  socket.on('gy', function(msg){
    socket.broadcast.emit('gy',msg);
  });
  socket.on('gz', function(msg){
    socket.broadcast.emit('gz',msg);
  });
});


http.listen(process.env.PORT || 8000, function(){
  console.log('listening on *:8000');
});
