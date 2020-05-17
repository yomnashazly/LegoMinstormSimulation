/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
var scene;
var clock;
var light;
var frontOfRobot;
// localStorage.setItem("scene", scene);
var move = false;
var rotate = true;
var head;
var cube2;
var triangleGeometry, triangleGeometry2, triangleGeometry3, triangleGeometry4;
var wheel, wheel2, wheel3, wheel4, wheel5, body, wheel6;
// localStorage.setItem("wheel", wheel);
var mouseX = 0,
	mouseY = 0,
	mouseZ = 0;

var valueNode;
var rtTexture;

var imgTexture;
var pixelX, pixelY;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
// localStorage.setItem("wheel2", wheel2);
// localStorage.setItem("wheel3", wheel3);
// localStorage.setItem("wheel4", wheel4);
// localStorage.setItem("wheel5", wheel5);
// //localStorage.setItem("wheel6", wheel6);
// localStorage.setItem("body", body);
var angle = 0;
var wheelAngle = 0;
var robot = "complexRobot";
var itn = 1;
// localStorage.setItem("robot", robot);
var group;
var cube;
var material;
var touchSensor;
var touchSensorOn = false;

var raycaster, mouse;
// localStorage.setItem("touchSensor", touchSensor);
// localStorage.setItem("touchSensorOn", touchSensorOn);
var object;
var colourSensor;
var colourSensorOn = false;
var colourSensorMode;
// localStorage.setItem("colourSensor", colourSensor);
// localStorage.setItem("colourSensorOn", colourSensorOn);
// localStorage.setItem("colourSensorMode", colourSensorMode);

var ultrasonicSensor = 0;
var ultrasonicSensorOn = true;
// localStorage.setItem("ultrasonicSensor", ultrasonicSensor);
// localStorage.setItem("ultrasonicSensorOn", ultrasonicSensorOn);

var gyroSensorRateofRotation;
var gyroSensorTotalAngleRotation = 0;
var gyroSensorOn = false;
// localStorage.setItem("gyroSensorRateofRotation", gyroSensorRateofRotation);
// localStorage.setItem(
//   "gyroSensorTotalAngleRotation",
//   gyroSensorTotalAngleRotation
// );
// localStorage.setItem("gyroSensorOn", gyroSensorOn);

var infraredSensor;
var infraredSensorOn = false;
var infraredSensorMode;
// localStorage.setItem("intraredSensor", infraredSensor);
// localStorage.setItem("infraredSensorOn", infraredSensorOn);
// localStorage.setItem("infraredSensorMode", infraredSensorMode);

var infraredBeacon;
var infraredBeaconOn = false;
var infraredBeaconMode;
// localStorage.setItem("infraredBeacon", infraredBeacon);
// localStorage.setItem("infraredBeaconOn", infraredBeaconOn);
// localStorage.setItem("infraredBeaconMode", infraredBeaconMode);

var robotX;
var robotY;
var robotZ;
// localStorage.setItem("robotX", robotX);
// localStorage.setItem("robotY", robotY);
// localStorage.setItem("robotZ", robotZ);
var bbox;
var xMin, xMax, yMin, yMax, zMin, zMax;
var canvas = document.getElementById( "canvas" );


var storageRef;
var intersectionPoint = new THREE.Vector3( );
var triangle; 
