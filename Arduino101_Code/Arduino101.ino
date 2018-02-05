#include <CurieBLE.h>
#include "CurieIMU.h"

//Create UUIDs : https://www.uuidgenerator.net/
#define Service_UUID "12db3240-d2c6-4d48-b839-14f259102c84"
#define T_UUID "018adaea-6abc-4794-bbaf-f057a93cbad2"
#define X_UUID "a7c18ce4-282b-4eb6-b7b7-d42dc9b6b792"
#define Y_UUID "fd28c492-d9af-4c88-b4d9-1be5a0266fac"
#define Z_UUID "4da2ab5c-1c71-4236-9756-45250cf43a13"
#define GX_UUID "c39537b4-1cfb-4b90-8114-6b93119d1f3f"
#define GY_UUID "5a7d839e-639e-4678-b678-ca803e377bc4"
#define GZ_UUID "9767f420-c0ee-44f5-a531-191913ce5d41"


BLEPeripheral blePeripheral;
BLEService imuService(Service_UUID);

//Define IMU datapoint
BLEIntCharacteristic tsChar(T_UUID, BLERead | BLENotify | BLEWrite);

BLEIntCharacteristic axChar(X_UUID, BLERead | BLENotify);
BLEIntCharacteristic ayChar(Y_UUID, BLERead | BLENotify);
BLEIntCharacteristic azChar(Z_UUID, BLERead | BLENotify);

BLEIntCharacteristic gxChar(GX_UUID, BLERead | BLENotify);
BLEIntCharacteristic gyChar(GY_UUID, BLERead | BLENotify);
BLEIntCharacteristic gzChar(GZ_UUID, BLERead | BLENotify);



// Pin to indicate that BLE is connected
const int ledPin = 13;
int ts;
int ax, ay, az;         // accelerometer values
int gx, gy, gz;         // gyrometer values
long previousMillis;
long currentMillis;

void setup() {
  Serial.begin(9600);

  //Initialize IMU
  Serial.println("Initializing IMU.  Board should be flat and motionless");
  CurieIMU.begin();
  CurieIMU.autoCalibrateGyroOffset();
  CurieIMU.autoCalibrateAccelerometerOffset(X_AXIS, 0);
  CurieIMU.autoCalibrateAccelerometerOffset(Y_AXIS, 0);
  CurieIMU.autoCalibrateAccelerometerOffset(Z_AXIS, 0);

  //Initialize BLE Peripheral
  blePeripheral.setDeviceName("set0101");
  blePeripheral.setLocalName("set0101");
  blePeripheral.setAdvertisedServiceUuid(imuService.uuid());
  blePeripheral.addAttribute(imuService);
  blePeripheral.addAttribute(tsChar);
  blePeripheral.addAttribute(axChar);
  blePeripheral.addAttribute(ayChar);
  blePeripheral.addAttribute(azChar);
  blePeripheral.addAttribute(gxChar);
  blePeripheral.addAttribute(gyChar);
  blePeripheral.addAttribute(gzChar);

  //fqChar.setValue(200); //Set the initial frequency to 200 milliseconds --> 5Hz

  //Activate BLE Peripheral
  blePeripheral.begin();
  Serial.println("BLE is active and waiting for connections");
}

void loop(){
  //Check if there is a connection to central
  BLECentral central = blePeripheral.central();
  ts=200;//set initial frequency

  if(central){
    Serial.print("Connected to central: ");
    Serial.print(central.address());
    digitalWrite(ledPin, HIGH);

  while(central.connected()){
      currentMillis = millis();


      if (tsChar.written()){
        ts = tsChar.value();
        Serial.print("Frequency Changed!!!");
        Serial.print(ts);
        tsChar.setValue(ts);
        }

      if (currentMillis - previousMillis >= ts) {
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
 tsChar.setValue(ts);
 axChar.setValue(ax);
 ayChar.setValue(ay);
 azChar.setValue(az);
 gxChar.setValue(gx);
 gyChar.setValue(gy);
 gzChar.setValue(gz);
 serialprintData();
}

void serialprintData(){
  Serial.print(currentMillis);
  Serial.print("\t");
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
