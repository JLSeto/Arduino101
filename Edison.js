var noble = require('noble');
var fs = require('fs');
var io = require('socket.io-client')

var IM_UUID = "8087422f2f5e434497c49b56a2fe9572";
var AX_UUID = "a7c18ce4282b4eb6b7b7d42dc9b6b792";
var AY_UUID = "72b57288-2bb5-402e-89e9-77b867c66ccb";

//This Function starts a scan.  Must detect bluetooth on or not first.

var socket = io.connect('http://localhost:8000', {reconnect: true});

socket.on('connect', function() {
  console.log('Connected to server');
  socket.emit('chat message', 'hello');
});


noble.on('stateChange', function(state){
	if(state == 'poweredOn'){
		noble.startScanning([IM_UUID]);
		console.log('Scanning...');
	}
	else{
		noble.stopScanning();
	}

});

noble.on('discover', function(peripheral){
	peripheral.connect(function(error){
		console.log('connected to: ', peripheral.uuid);

	//console.log('found peripheral: ', peripheral.advertisement)
		peripheral.discoverServices([IM_UUID],function(error, services){
			var service = services[0];
			console.log('Discovered IMU service');

			service.discoverCharacteristics([],function(error,characteristics){
				console.log('discovered characteristics');

        	characteristics.forEach(function(characteristic) {
          	emitSensorData(characteristic);
        	});


			});

		});

	});

});

function getSocketLabel(uuid) {
  var label = null;

  if(uuid == AX_UUID) {
    label = 'ax:edison';
  }
}

function emitSensorData(characteristic) {
  var socketLabel = getSocketLabel(characteristic.uuid);
  console.log(socketLabel);

  characteristic.on('read', function(data) {

  	//fs.appendFile('/home/root/hello/a.txt', data.readInt8(0));
  	console.log('Sensor Value', data.readInt8(0));
		socket.emit('chat message', data.readInt8(0));
  });

  characteristic.notify('true', function(error) { if (error) throw error; });
}
