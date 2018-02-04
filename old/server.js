var express = require('express');
var app = require('express')();
var http = require('http').Server(app);

const WebSocket = require('ws');
var wss = new WebSocket.Server({ port: 8080 });

var dataoject = {};

app.use(express.static(__dirname + '/public'));

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log(message);

    wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });

  });

});


http.listen(process.env.PORT || 8000, function(){
  console.log('listening on *:8000');
});
