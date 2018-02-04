var noble = require('noble');
const WebSocket = require('ws');

var ws = new WebSocket('ws://localhost:8080');

var IM_UUID = "12db3240d2c64d48b83914f259102c84";
var TS_UUID = "018adaea6abc4794bbaff057a93cbad2"
var AX_UUID = "a7c18ce4282b4eb6b7b7d42dc9b6b792";
var AY_UUID = "fd28c492d9af4c88b4d91be5a0266fac"
var AZ_UUID = "4da2ab5c1c714236975645250cf43a13"
var GX_UUID = "c39537b41cfb4b9081146b93119d1f3f"
var GY_UUID = "5a7d839e639e4678b678ca803e377bc4"
var GZ_UUID = "9767f420c0ee44f5a531191913ce5d41"

var ts = null;
var ax = null;
var ay = null;
var az = null;
var gx = null;
var gy = null;
var gz = null;
var data = {};

//This Function starts a scan.  Must detect bluetooth on or not first.
noble.on('stateChange', function(state){
	if(state == 'poweredOn'){
		noble.startScanning([IM_UUID],false);
		console.log('Scanning...');
	}
	else{
		noble.stopScanning();
	}
});

noble.on('discover', function(peripheral) {
  // we found a peripheral, stop scanning
  noble.stopScanning();
  console.log('found peripheral:', peripheral.advertisement);

	peripheral.connect(function(err) {
		peripheral.discoverServices([IM_UUID],function(err,services){
			services.forEach(function(service){
				console.log('Found Service: ', service.uuid);

				service.discoverCharacteristics([], function(err, characteristics){
					characteristics.forEach(function(characteristic){
						console.log('found characteristic: ', characteristic.uuid);
						if(TS_UUID==characteristic.uuid){
							ts = characteristic;
						}
						if(AX_UUID==characteristic.uuid){
							ax = characteristic;
						}
						if(AY_UUID==characteristic.uuid){
							ay = characteristic;
						}
						if(AZ_UUID==characteristic.uuid){
							az = characteristic;
						}
						if(GX_UUID==characteristic.uuid){
							gx = characteristic;
						}
						if(GY_UUID==characteristic.uuid){
							gy = characteristic;
						}
						if(GZ_UUID==characteristic.uuid){
							gz = characteristic;
						}
					});
					if(ts && ax && az && az && gx && gy && gz){
						shiraseru();//turn on on notifications
						detawoOkuru();
						console.log("yay");
					}
					else{
						console.log("shit...");
					}

				});
			});
		});
	});

});

function shiraseru(){
	ts.notify('true', function(error) {
		if (error) throw error;
	});
	ax.notify('true', function(error) {
		if (error) throw error;
	});
	ay.notify('true', function(error) {
		if (error) throw error;
	});
	az.notify('true', function(error) {
		if (error) throw error;
	});
	gx.notify('true', function(error) {
		if (error) throw error;
	});
	gy.notify('true', function(error) {
		if (error) throw error;
	});
	gz.notify('true', function(error) {
		if (error) throw error;
	});
}



function detawoOkuru(){
	//Note: Data is harcoded to be sent in a certain order at a lower level...
	ts.on('read', function(data) {
		//console.log("AX: ",data.readInt32LE(0));
		ws.send('aaax',data.readInt32LE(0));
	});
	ax.on('read', function(data) {
		//console.log("AX: ",data.readInt32LE(0));
		ws.send(data.readInt32LE(0));
	});
	ay.on('read', function(data) {
		//console.log("AY: ", data.readInt32LE(0));
		ws.send(data.readInt32LE(0));
	});
	az.on('read', function(data) {
		//console.log("AZ: ",data.readInt32LE(0));
		ws.send(data.readInt32LE(0));
	});
	gx.on('read', function(data) {
		//console.log("GX: ", data.readInt32LE(0));
		ws.send(data.readInt32LE(0));
	});
	gy.on('read', function(data) {
		//console.log("GY: ",data.readInt32LE(0));
		ws.send(data.readInt32LE(0));
	});
	gz.on('read', function(data) {
		//console.log("GZ: ", data.readInt32LE(0));
		ws.send(data.readInt32LE(0));
	});

	console.log('yaaa');
}
