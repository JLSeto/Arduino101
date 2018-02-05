var app = angular.module('myApp', []);

app.controller('myCtrl', function($scope, socket){

$scope.t = 'N/A';
$scope.ax = 'N/A';
$scope.ay = 'N/A';
$scope.az = 'N/A';
$scope.gx = 'N/A';
$scope.gy = 'N/A';
$scope.gz = 'N/A';

socket.on('connect', function(){
	console.log("connected");
});
socket.on('t', function(data){
	$scope.t = data;
});
socket.on('ax', function(data){
	$scope.ax = data;
});
socket.on('ay', function(data){
	$scope.ay = data;
});
socket.on('az', function(data){
	$scope.az = data;
});
socket.on('gx', function(data){
	$scope.gx = data;
});
socket.on('gy', function(data){
	$scope.gy = data;
});
socket.on('gz', function(data){
	$scope.gz = data;
});

$scope.changFreq = function(){
console.log($scope.frequency);
socket.emit('freq',$scope.frequency);

};


});




/* Services */
app.factory('socket', function ($rootScope) {
  var socket = io.connect();
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      })
    }
  };
});
