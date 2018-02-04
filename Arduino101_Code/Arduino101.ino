#include <CurieBLE.h>
#include "CurieIMU.h"

//Create UUIDs : https://www.uuidgenerator.net/
#define Service_UUID "8087422f-2f5e-4344-97c4-9b56a2fe9572"
#define X_UUID "a7c18ce4-282b-4eb6-b7b7-d42dc9b6b792"
#define Y_UUID "fd28c492-d9af-4c88-b4d9-1be5a0266fac"
#define Z_UUID "4da2ab5c-1c71-4236-9756-45250cf43a13"
#define GX_UUID "c39537b4-1cfb-4b90-8114-6b93119d1f3f"
#define GY_UUID "5a7d839e-639e-4678-b678-ca803e377bc4"
#define GZ_UUID "9767f420-c0ee-44f5-a531-191913ce5d41"

BLEPeripheral blePeripheral;
BLEService imuService(Service_UUID);

//Define IMU datapoint
BLEIntCharacteristic axChar(X_UUID, BLERead | BLENotify);
BLEIntCharacteristic ayChar(X_UUID, BLERead | BLENotify);
BLEIntCharacteristic azChar(X_UUID, BLERead | BLENotify);

BLEIntCharacteristic gxChar(X_UUID, BLERead | BLENotify);
BLEIntCharacteristic gyChar(X_UUID, BLERead | BLENotify);
BLEIntCharacteristic gzChar(X_UUID, BLERead | BLENotify);

// Pin to indicate that BLE is connected
const int ledPin = 13;
int ax, ay, az;         // accelerometer values
int gx, gy, gz;         // gyrometer values
long previousMillis;
long currentMillis;

void setup() {
  Serial.begin(9600);

  //Initialize IMU
  Serial.println("Initializing IMU.  Board should be flat and motionless");
  CurieIMU.begin();
  CurieIMU.autoCalibrateAccelerometerOffset(X_AXIS, 0);
  CurieIMU.autoCalibrateAccelerometerOffset(Y_AXIS, 0);
  CurieIMU.autoCalibrateAccelerometerOffset(Z_AXIS, 0);

  //Initialize BLE Peripheral
  blePeripheral.setDeviceName("set0101");
  blePeripheral.setLocalName("set0101");
  blePeripheral.setAdvertisedServiceUuid(imuService.uuid());
  blePeripheral.addAttribute(imuService);
  blePeripheral.addAttribute(axChar);
  blePeripheral.addAttribute(ayChar);
  blePeripheral.addAttribute(azChar);
  blePeripheral.addAttribute(gxChar);
  blePeripheral.addAttribute(gyChar);
  blePeripheral.addAttribute(gzChar);

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

void updateImuData(){
 CurieIMU.readMotionSensor(ax, ay, az, gx, gy, gz);
 serialprintData();
 axChar.setValue(ax);
 axChar.setValue(ay);
 axChar.setValue(az);
 axChar.setValue(gx);
 axChar.setValue(gy);
 axChar.setValue(gz);

}

void serialprintData(){
  Serial.print(ax);
  Serial.print("\t");
  Serial.print(ay);
  Serial.print("\t");
  Serial.print(az);
  Serial.print("\t");
  Serial.print(gx);
  Serial.print("\t");
  Serial.print(gy);
  Serial.print("\t");
  Serial.println(gz);
}
