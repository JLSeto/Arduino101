var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Monji = require('mongodb').MongoClient;
const crypto = require('crypto');

app.use(express.static(__dirname + '/public'));

//var url = "mongodb://localhost:27017/mydb";


io.on('connection', function(socket){
  console.log('a user connected');
  var obj = {};

  socket.on('freq', function(msg){
    console.log(msg);
    socket.broadcast.emit('freq',msg);
  });

  socket.on('t', function(msg){
    var code = crypto.randomBytes(3).toString('hex');
    obj['_id']=code
    obj['t']=msg;
    socket.broadcast.emit('t',msg);
  });
  socket.on('ax', function(msg){
    obj['ax']=msg;
    socket.broadcast.emit('ax',msg);
  });
  socket.on('ay', function(msg){
    obj['ay']=msg;
    socket.broadcast.emit('ay',msg);
  });
  socket.on('az', function(msg){
    obj['az']=msg;
    socket.broadcast.emit('az',msg);
  });
  socket.on('gx', function(msg){
    obj['gx']=msg;
    socket.broadcast.emit('gx',msg);
  });
  socket.on('gy', function(msg){
    obj['gy']=msg;
    socket.broadcast.emit('gy',msg);
  });
  socket.on('gz', function(msg){
    obj['gz']=msg;
    socket.broadcast.emit('gz',msg);
    socket.broadcast.emit('something',obj);
/*
    Monji.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db("newdb");
      dbo.collection("sensordata").insert(obj, function(err, res) {
        if (err) throw err;
        console.log("1 document inserted");
        db.close();
      });
    });
*/
  });

});


http.listen(process.env.PORT || 8000, function(){
  console.log('listening on *:8000');
});
