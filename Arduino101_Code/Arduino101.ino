#include <CurieBLE.h>
#include "CurieIMU.h"

//Create UUIDs : https://www.uuidgenerator.net/

#define Service_UUID "8087422f-2f5e-4344-97c4-9b56a2fe9572"
#define X_UUID "a7c18ce4-282b-4eb6-b7b7-d42dc9b6b792"

// Defines Arduino 101 as a BLE Peripheral Device.
//Register IMU Data as a BLE Service

BLEPeripheral blePeripheral;
BLEService imuService(Service_UUID);

//Define IMU datapoint

BLEIntCharacteristic axChar(X_UUID, BLERead | BLENotify);

// Pin to indicate that BLE is connected
const int ledPin = 13;
int ax, ay, az;         // accelerometer values
int gx, gy, gz;         // gyrometer values
long previousMillis;
long currentMillis;
int oldax = 0;

int count = 0;

void setup() {
  Serial.begin(9600);

  //Initialize IMU
  Serial.println("Initializing IMU");
  CurieIMU.begin();
  CurieIMU.autoCalibrateAccelerometerOffset(X_AXIS, 0);

  //Initialize BLE Peripheral
  blePeripheral.setLocalName("Seto101");
  blePeripheral.setAdvertisedServiceUuid(imuService.uuid());
  blePeripheral.addAttribute(imuService);
  blePeripheral.addAttribute(axChar);

  //Set Initial Values
  //axChar.setValue(ax);

  //Activate BLE Peripheral
  blePeripheral.begin();
  Serial.println("BLE is active and waiting for connections");
}

void loop(){
  //Check if there is a connection to central
  BLECentral central = blePeripheral.central();

  if(central){
    Serial.print("Connected to central: ");
    Serial.print(central.address());
    digitalWrite(ledPin, HIGH);

  while(central.connected()){
      currentMillis = millis();

      if (currentMillis - previousMillis >= 20) {
        previousMillis = currentMillis;
        updateImuData();
      }

    }
    Serial.print("Disconnected from central: ");
    Serial.print(central.address());
    digitalWrite(ledPin, LOW);
  }
}

void updatenanoImuData(){
 CurieIMU.readMotionSensor(ax, ay, az, gx, gy, gz);
 Serial.println(ax);
 axChar.setValue(ax);

}
