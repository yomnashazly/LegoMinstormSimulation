/* eslint-disable no-undef */

function touchSensorFunction() {

	// if (touchSensorOn == false) {
	//   //touchSensorOn = false;
	//   document.getElementById("sensorValue").value = "Touch Sensor = Off";
	// } else {
	document.getElementById( 'Touch' ).innerHTML =
    'Touch Sensor = On, Value = ' + touchSensor;
	// }

}

function colourSensorFunction() {


var value = new Array( group.children.length );

	for ( var i = 0; i < group.children.length; i ++ ) {


		var child = group.children[ i ];

		// var box = new THREE.Box3();

		// child.geometry.computeBoundingBox();


		// box.copy( child.geometry.boundingBox ).applyMatrix4( mesh.matrixWorld );

		var fig1 = [
			{ x: child.position.x - 5, y: child.position.z - 5 },
			{ x: child.position.x + 5, y: child.position.z - 5 },
			{ x: child.position.x + 5, y: child.position.z + 5 },
			{ x: child.position.x - 5, y: child.position.z + 5 },

		];


		// var fig1 = [
		// 	{ x: box.min.x, y: box.min.z },
		// 	{ x: box.min.x, y: box.max.z },
		// 	{ x: box.max.x, y: box.max.z },
		// 	{ x: box.max.x, y: box.min.z }
		// ];


		var fig2 = [
			{ x: triangleGeometry4.vertices[ 0 ].x, y: triangleGeometry4.vertices[ 0 ].z },
			{ x: triangleGeometry4.vertices[ 1 ].x, y: triangleGeometry4.vertices[ 1 ].z },
			{ x: triangleGeometry4.vertices[ 2 ].x, y: triangleGeometry4.vertices[ 2 ].z }

		];

		

		var result = intersect( fig1, fig2 );
		console.log( result[ 0 ] );


		//	var isInside = pointIsInPoly( child.position, triangleGeometry );
		if ( result[ 0 ] != undefined ) {

			value[ i ] = true;
			colourSensor = child.material.color.getHexString();
			document.getElementById( 'Colour' ).innerHTML =
        'Colour Sensor = On, Mode = Colour, Value = ' + colourSensor;

		} else {

			value[ i ] = false;

		}

	}

	var counter = 0;
	for ( var i = 0; i < value.length; i ++ ) {

		if ( value[ i ] == true ) {

			counter ++;

		}

	}
	if ( counter == 0 ) {

		colourSensor = 0;
		document.getElementById( 'Colour' ).innerHTML =
    'Colour Sensor = On, Mode = Colour, Value = ' + colourSensor;

	}

}

function colourSensorReflectedFunction() {

	if ( colourSensorOn == true ) {

		document.getElementById( 'sensorValue' ).value = 'Colour Sensor = Off';
		colourSensorOn = false;

	} else {

		colourSensorOn = true;

		if ( document.getElementById( 'reflected' ) ) {

			document.getElementById( 'sensorValue' ).value =
        'Colour Sensor = On, Mode = Reflected Light Intensity';

		}

	}

}

function colourSensorAmbientFunction() {

	// if (colourSensorOn == true) {
	//   document.getElementById("sensorValue").value = "Colour Sensor = Off";
	//   colourSensorOn = false;
	// } else {
	//   colourSensorOn = true;

	//   if (document.getElementById("ambient")) {
	//     document.getElementById("sensorValue").value =
	//       "Colour Sensor = On, Mode = Ambient Light Intensity";
	//   }
	// }

	document.getElementById( 'Colour' ).innerHTML =
    'Colour Sensor = On, Mode = Ambient Light Intensity, Value = ' +
    light.intensity * 100;

}

function ultrasonicSensorFunction2() {

	// if (ultrasonicSensorOn == true) {
	//   document.getElementById("sensorValue").value = "Ultrasonic Sensor = Off";
	//   ultrasonicSensorOn = false;
	// } else {
	//  console.log(group.children.length);
	for ( var i = 0; i < group.children.length; i ++ ) {

		var child = group.children[ i ];
		console.log( i );
		// document.getElementById("sensorValue").value = "Ultrasonic Sensor = On";
		var changeX = child.position.x - cube2.position.x;
		var changeZ = child.position.z - cube2.position.z;
		console.log( changeX, changeZ );

		//console.log(angle);
		// if (i == 1) {
		//   console.log(
		//     "angle" + angle,
		//     "change" + changeZ,
		//     gyroSensorTotalAngleRotation
		//   );
		// }
		// console.log(angle);

		// console.log(cube.position.x, cube2.position.x);
		// console.log(cube.position.z, cube2.position.z);

		// console.log(angle, changeZ, changeX);
		if (
			( gyroSensorTotalAngleRotation <= 60 ||
        330 <= gyroSensorTotalAngleRotation ) &&
      changeX <= 0
		) {

			if ( Math.sqrt( changeX * changeX + changeZ * changeZ ) <= 255 ) {

				var angle = Math.atan( changeZ / changeX );
				//  console.log("angle" + gyroSensorTotalAngleRotation);
				// console.log(cube.position.x, cube2.position.x);
				// console.log(cube.position.z, cube2.position.z);

				// console.log(angle, changeZ, changeX);
				angle = ( angle * 180 ) / Math.PI;
				if ( angle <= 30 && - 30 <= angle ) {

					ultrasonicSensor = Math.sqrt( changeX * changeX + changeZ * changeZ );
					document.getElementById( 'sensorValue' ).value =
            'UltraSonic  = On, value= ' +
            ultrasonicSensor +
            'child' +
            i +
            'gyro ang' +
            gyroSensorTotalAngleRotation +
            '   ' +
            child.position.x +
            '   ' +
            child.position.z +
            ' ' +
            Math.floor( angle ) +
            cube2.position.x +
            '  ' +
            cube2.position.z;

				}

			}

		}
		if (
			gyroSensorTotalAngleRotation <= 150 &&
      60 <= gyroSensorTotalAngleRotation &&
      changeZ <= 0
		) {

			if ( Math.sqrt( changeX * changeX + changeZ * changeZ ) <= 255 ) {

				var angle = Math.atan( changeX / changeZ );
				//  console.log("angle" + gyroSensorTotalAngleRotation);
				// console.log(cube.position.x, cube2.position.x);
				// console.log(cube.position.z, cube2.position.z);

				// console.log(angle, changeZ, changeX);
				angle = ( angle * 180 ) / Math.PI;
				if ( angle <= 30 && - 30 <= angle ) {

					ultrasonicSensor = Math.sqrt( changeX * changeX + changeZ * changeZ );
					document.getElementById( 'sensorValue' ).value =
            'UltraSonic  = On, value= ' +
            ultrasonicSensor +
            'child' +
            i +
            'gyro ang' +
            gyroSensorTotalAngleRotation +
            '   ' +
            child.position.x +
            '   ' +
            child.position.z +
            ' ' +
            Math.floor( angle ) +
            '  ' +
            cube2.position.x +
            '  ' +
            cube2.position.z;

				}

			}

		}
		if (
			gyroSensorTotalAngleRotation <= 240 &&
      150 <= gyroSensorTotalAngleRotation &&
      changeX >= 0
		) {

			if ( Math.sqrt( changeX * changeX + changeZ * changeZ ) <= 255 ) {

				var angle = Math.atan( changeZ / changeX );
				//  console.log("angle" + gyroSensorTotalAngleRotation);
				// console.log(cube.position.x, cube2.position.x);
				// console.log(cube.position.z, cube2.position.z);

				// console.log(angle, changeZ, changeX);
				angle = ( angle * 180 ) / Math.PI;
				if ( angle <= 30 && - 30 <= angle ) {

					ultrasonicSensor = Math.sqrt( changeX * changeX + changeZ * changeZ );
					document.getElementById( 'sensorValue' ).value =
            'UltraSonic  = On, value= ' +
            ultrasonicSensor +
            'child' +
            i +
            'gyro ang' +
            gyroSensorTotalAngleRotation +
            '   ' +
            child.position.x +
            '   ' +
            child.position.z +
            ' ' +
            Math.floor( angle ) +
            '  ' +
            cube2.position.x +
            '  ' +
            cube2.position.z;

				}

			}

		}
		if (
			gyroSensorTotalAngleRotation <= 330 &&
      240 <= gyroSensorTotalAngleRotation &&
      changeZ >= 0
		) {

			if ( Math.sqrt( changeX * changeX + changeZ * changeZ ) <= 255 ) {

				var angle = Math.atan( changeX / changeZ );
				//  console.log("angle" + gyroSensorTotalAngleRotation);
				// console.log(cube.position.x, cube2.position.x);
				// console.log(cube.position.z, cube2.position.z);

				// console.log(angle, changeZ, changeX);
				angle = ( angle * 180 ) / Math.PI;
				if ( angle <= 30 && - 30 <= angle ) {

					ultrasonicSensor = Math.sqrt( changeX * changeX + changeZ * changeZ );
					document.getElementById( 'sensorValue' ).value =
            'UltraSonic  = On, value= ' +
            ultrasonicSensor +
            'child' +
            i +
            'gyro ang' +
            gyroSensorTotalAngleRotation +
            '   ' +
            child.position.x +
            '   ' +
            child.position.z +
            ' ' +
            Math.floor( angle ) +
            '  ' +
            cube2.position.x +
            '  ' +
            cube2.position.z;

				}

			}

		}

	}

}

function gyroSensorFunction() {

	// if (gyroSensorOn == true) {
	//   document.getElementById("sensorValue").value = "Gyro Sensor = Off";
	//   gyroSensorOn = false;
	// } else {
	//   gyroSensorOn = true;
	document.getElementById( 'Gyro' ).innerHTML =
    ' Gyro Sensor = On, Rate of Rotation:' +
    gyroSensorRateofRotation +
    'Total Angle:' +
    gyroSensorTotalAngleRotation;

}

function ultrasonicSensorFunction() {


	var value = new Array( group.children.length );

	for ( var i = 0; i < group.children.length; i ++ ) {


		var child = group.children[ i ];

		// var box = new THREE.Box3();

		// child.geometry.computeBoundingBox();


		// box.copy( child.geometry.boundingBox ).applyMatrix4( mesh.matrixWorld );

		var fig1 = [
			{ x: child.position.x - 5, y: child.position.z - 5 },
			{ x: child.position.x + 5, y: child.position.z - 5 },
			{ x: child.position.x + 5, y: child.position.z + 5 },
			{ x: child.position.x - 5, y: child.position.z + 5 },

		];


		// var fig1 = [
		// 	{ x: box.min.x, y: box.min.z },
		// 	{ x: box.min.x, y: box.max.z },
		// 	{ x: box.max.x, y: box.max.z },
		// 	{ x: box.max.x, y: box.min.z }
		// ];


		var fig2 = [
			{ x: triangleGeometry.vertices[ 0 ].x, y: triangleGeometry.vertices[ 0 ].z },
			{ x: triangleGeometry.vertices[ 1 ].x, y: triangleGeometry.vertices[ 1 ].z },
			{ x: triangleGeometry.vertices[ 2 ].x, y: triangleGeometry.vertices[ 2 ].z }

		];

		console.log( triangleGeometry.vertices[ 0 ].x, triangleGeometry.vertices[ 0 ].z );

		console.log( triangleGeometry.vertices[ 1 ].x, triangleGeometry.vertices[ 1 ].z );

		console.log( triangleGeometry.vertices[ 2 ].x, triangleGeometry.vertices[ 2 ].z );

		var result = intersect( fig1, fig2 );
		console.log( result[ 0 ] );


		//	var isInside = pointIsInPoly( child.position, triangleGeometry );
		if ( result[ 0 ] != undefined ) {


			var changeX = child.position.x - cube2.position.x;
			var changeZ = child.position.z - cube2.position.z;
			ultrasonicSensor = Math.sqrt( changeX * changeX + changeZ * changeZ );
			document.getElementById( 'Ultrasonic' ).innerHTML =
        'Ultrasonic Sensor = On, value= ' + ultrasonicSensor + " " + i;

			value[ i ] = true;

		} else {

			value[ i ] = false;

		}

	}


	var counter = 0;
	for ( var i = 0; i < value.length; i ++ ) {

		if ( value[ i ] == true ) {

			counter ++;

		}

	}
	if ( counter == 0 ) {

		ultrasonicSensor = 0;
		document.getElementById( 'Ultrasonic' ).innerHTML =
    'Ultrasonic Sensor = On,  Value = ' + ultrasonicSensor;

	}




}
function ultrasonicSensorFunction3() {

	var value = new Array( group.children.length );

	for ( var i = 0; i < group.children.length; i ++ ) {

		var child = group.children[ i ];
		var isInside = pointIsInPoly( child.position, triangleGeometry );
		//var isInside = pointIsInPoly2( child, triangleGeometry );
		// if (isInside == false) {
		//   document.getElementById("sensorValue").value =
		//     "Infrared  = On, value= " + 0;
		// var box = new THREE.Box3();

		// child.geometry.computeBoundingBox();


		// box.copy( child.geometry.boundingBox ).applyMatrix4( mesh.matrixWorld );

		// }
		if ( isInside == true ) {

			// console.log( box.intersectsTriangle( triangle ) );
			// console.log( box.distanceToPoint( cube2.position ) );
			// console.log( triangle.a );
			var changeX = child.position.x - cube2.position.x;
			var changeZ = child.position.z - cube2.position.z;
			ultrasonicSensor = Math.sqrt( changeX * changeX + changeZ * changeZ );
			document.getElementById( 'Ultrasonic' ).innerHTML =
        'Ultrasonic Sensor = On, value= ' + ultrasonicSensor;

			value[ i ] = true;

		} else {

			value[ i ] = false;

		}

	}

	var counter = 0;
	for ( var i = 0; i < value.length; i ++ ) {

		if ( value[ i ] == true ) {

			counter ++;

		}

	}
	if ( counter == 0 ) {

		ultrasonicSensor = 0;
		document.getElementById( 'Ultrasonic' ).innerHTML =
    'Ultrasonic Sensor = On,  Value = ' + ultrasonicSensor;

	}

}
function infraredSensorProximityFunction() {


	var value = new Array( group.children.length );

	for ( var i = 0; i < group.children.length; i ++ ) {


		var child = group.children[ i ];

		// var box = new THREE.Box3();

		// child.geometry.computeBoundingBox();


		// box.copy( child.geometry.boundingBox ).applyMatrix4( mesh.matrixWorld );

		var fig1 = [
			{ x: child.position.x - 5, y: child.position.z - 5 },
			{ x: child.position.x + 5, y: child.position.z - 5 },
			{ x: child.position.x + 5, y: child.position.z + 5 },
			{ x: child.position.x - 5, y: child.position.z + 5 },

		];


		// var fig1 = [
		// 	{ x: box.min.x, y: box.min.z },
		// 	{ x: box.min.x, y: box.max.z },
		// 	{ x: box.max.x, y: box.max.z },
		// 	{ x: box.max.x, y: box.min.z }
		// ];


		var fig2 = [
			{ x: triangleGeometry2.vertices[ 0 ].x, y: triangleGeometry2.vertices[ 0 ].z },
			{ x: triangleGeometry2.vertices[ 1 ].x, y: triangleGeometry2.vertices[ 1 ].z },
			{ x: triangleGeometry2.vertices[ 2 ].x, y: triangleGeometry2.vertices[ 2 ].z }

		];

		console.log( triangleGeometry.vertices[ 0 ].x, triangleGeometry.vertices[ 0 ].z );

		console.log( triangleGeometry.vertices[ 1 ].x, triangleGeometry.vertices[ 1 ].z );

		console.log( triangleGeometry.vertices[ 2 ].x, triangleGeometry.vertices[ 2 ].z );

		var result = intersect( fig1, fig2 );
		console.log( result[ 0 ] );


		//	var isInside = pointIsInPoly( child.position, triangleGeometry );
		if ( result[ 0 ] != undefined ) {


			var changeX = child.position.x - cube2.position.x;
			var changeZ = child.position.z - cube2.position.z;
			infraredSensor = Math.sqrt( changeX * changeX + changeZ * changeZ ) / 70 * 100;
			document.getElementById( 'Infrared' ).innerHTML =
        'Infrared Sensor = On, value= ' + infraredSensor + " " + i;

			value[ i ] = true;

		} else {

			value[ i ] = false;

		}

	}


	var counter = 0;
	for ( var i = 0; i < value.length; i ++ ) {

		if ( value[ i ] == true ) {

			counter ++;

		}

	}
	if ( counter == 0 ) {

		infraredSensor = 0;
		document.getElementById( 'Infrared' ).innerHTML =
        'Infrared Sensor = On, value= ' + infraredSensor + " " + i;

	}

}

function pointIsInPoly( p, polygon ) {

	var isInside = false;
	var minX = polygon.vertices[ 0 ].x,
		maxX = polygon.vertices[ 0 ].x;
	var minZ = polygon.vertices[ 0 ].z,
		maxZ = polygon.vertices[ 0 ].z;
	for ( var n = 1; n < polygon.vertices.length; n ++ ) {

		var q = polygon.vertices[ n ];
		minX = Math.min( q.x, minX );
		maxX = Math.max( q.x, maxX );
		minZ = Math.min( q.z, minZ );
		maxZ = Math.max( q.z, maxZ );

	}

	if ( p.x < minX || p.x > maxX || p.z < minZ || p.z > maxZ ) {

		return false;

	}

	var i = 0,
		j = polygon.vertices.length - 1;
	for ( i, j; i < polygon.vertices.length; j = i ++ ) {

		if (
			polygon.vertices[ i ].z > p.z != polygon.vertices[ j ].z > p.z &&
      p.x <
        ( ( polygon.vertices[ j ].x - polygon.vertices[ i ].x ) *
          ( p.z - polygon.vertices[ i ].z ) ) /
          ( polygon.vertices[ j ].z - polygon.vertices[ i ].z ) +
          polygon.vertices[ i ].x
		) {

			isInside = ! isInside;

		}

	}

	return isInside;

}


function infraredSensorProximityFunction2() {

	for ( var i = 0; i < group.children.length; i ++ ) {

		var child = group.children[ i ];
		//console.log(i);
		// document.getElementById("sensorValue").value = "Ultrasonic Sensor = On";
		var changeX = child.position.x - cube2.position.x;
		var changeZ = child.position.z - cube2.position.z;
		// console.log(changeX, changeZ);

		//console.log(angle);
		// if (i == 1) {
		//   console.log(
		//     "angle" + angle,
		//     "change" + changeZ,
		//     gyroSensorTotalAngleRotation
		//   );
		// }
		// console.log(angle);

		// console.log(cube.position.x, cube2.position.x);
		// console.log(cube.position.z, cube2.position.z);

		// console.log(angle, changeZ, changeX);

		if (
			gyroSensorTotalAngleRotation <= 85 ||
      275 <= gyroSensorTotalAngleRotation
		) {

			var angle = Math.atan( changeZ / changeX );
			angle = ( angle * 180 ) / Math.PI;

			if ( i == 1 ) {

				console.log(
					'angle' + angle,
					'change' +
            changeX +
            '  ' +
            gyroSensorTotalAngleRotation +
            '  ' +
            Math.sqrt( changeX * changeX + changeZ * changeZ ),
				);

			}
			if ( changeX <= 0 && angle <= 5 && - 5 <= angle ) {

				if ( Math.sqrt( changeX * changeX + changeZ * changeZ ) <= 100 ) {

					//  console.log("angle" + gyroSensorTotalAngleRotation);
					// console.log(cube.position.x, cube2.position.x);
					// console.log(cube.position.z, cube2.position.z);

					// console.log(angle, changeZ, changeX);

					// if (angle <= 5 && -5 <= angle) {
					infraredSensor =
            ( Math.sqrt( changeX * changeX + changeZ * changeZ ) / 70 ) * 100;
					document.getElementById( 'sensorValue' ).value =
            'Infrared  = On, value= ' +
            infraredSensor +
            'child' +
            i +
            'gyro ang' +
            gyroSensorTotalAngleRotation +
            '   ' +
            child.position.x +
            '   ' +
            child.position.z +
            ' ' +
            Math.floor( angle ) +
            '   ' +
            Math.sqrt( changeX * changeX + changeZ * changeZ );
					// } else {
					//   document.getElementById("sensorValue").value =
					//     "Infrared  = On, value= " +
					//     0 +
					//     "child" +
					//     i +
					//     "gyro ang" +
					//     gyroSensorTotalAngleRotation +
					//     "   " +
					//     child.position.x +
					//     "   " +
					//     child.position.z +
					//     " " +
					//     Math.floor(angle) +
					//     cube2.position.x +
					//     "  " +
					//     cube2.position.z;
					// }

				}

			}

		}
		if (
			gyroSensorTotalAngleRotation <= 95 &&
      85 <= gyroSensorTotalAngleRotation
		) {

			var angle = Math.atan( changeX / changeZ );
			angle = ( angle * 180 ) / Math.PI;
			if ( angle <= 5 && - 5 <= angle && changeZ <= 0 ) {

				if ( Math.sqrt( changeX * changeX + changeZ * changeZ ) <= 100 ) {

					//  console.log("angle" + gyroSensorTotalAngleRotation);
					// console.log(cube.position.x, cube2.position.x);
					// console.log(cube.position.z, cube2.position.z);

					// console.log(angle, changeZ, changeX);

					infraredSensor =
            ( Math.sqrt( changeX * changeX + changeZ * changeZ ) / 70 ) * 100;
					document.getElementById( 'sensorValue' ).value =
            'Infrared  = On, value= ' +
            infraredSensor +
            'child' +
            i +
            'gyro ang' +
            gyroSensorTotalAngleRotation +
            '   ' +
            child.position.x +
            '   ' +
            child.position.z +
            ' ' +
            Math.floor( angle ) +
            cube2.position.x +
            '  ' +
            cube2.position.z;
					// } else {
					//   document.getElementById("sensorValue").value =
					//     "Infrared  = On, value= " +
					//     0 +
					//     "child" +
					//     i +
					//     "gyro ang" +
					//     gyroSensorTotalAngleRotation +
					//     "   " +
					//     child.position.x +
					//     "   " +
					//     child.position.z +
					//     " " +
					//     Math.floor(angle) +
					//     cube2.position.x +
					//     "  " +
					//     cube2.position.z;
					// }

				}

			}

		}

		if (
			gyroSensorTotalAngleRotation <= 265 &&
      95 <= gyroSensorTotalAngleRotation
		) {

			var angle = Math.atan( changeZ / changeX );
			//  console.log("angle" + gyroSensorTotalAngleRotation);
			// console.log(cube.position.x, cube2.position.x);
			// console.log(cube.position.z, cube2.position.z);

			// console.log(angle, changeZ, changeX);
			angle = ( angle * 180 ) / Math.PI;
			if ( angle <= 5 && - 5 <= angle && changeX >= 0 ) {

				if ( Math.sqrt( changeX * changeX + changeZ * changeZ ) <= 100 ) {

					infraredSensor =
            ( Math.sqrt( changeX * changeX + changeZ * changeZ ) / 70 ) * 100;
					document.getElementById( 'sensorValue' ).value =
            'Infrared  = On, value= ' +
            infraredSensor +
            'child' +
            i +
            'gyro ang' +
            gyroSensorTotalAngleRotation +
            '   ' +
            child.position.x +
            '   ' +
            child.position.z +
            ' ' +
            Math.floor( angle ) +
            cube2.position.x +
            '  ' +
            cube2.position.z;
					// } else {
					//   document.getElementById("sensorValue").value =
					//     "Infrared  = On, value= " +
					//     0 +
					//     "child" +
					//     i +
					//     "gyro ang" +
					//     gyroSensorTotalAngleRotation +
					//     "   " +
					//     child.position.x +
					//     "   " +
					//     child.position.z +
					//     " " +
					//     Math.floor(angle) +
					//     cube2.position.x +
					//     "  " +
					//     cube2.position.z;
					// }

				}

			}

		}
		if (
			gyroSensorTotalAngleRotation <= 275 &&
      265 <= gyroSensorTotalAngleRotation
		) {

			var angle = Math.atan( changeX / changeZ );
			//  console.log("angle" + gyroSensorTotalAngleRotation);
			// console.log(cube.position.x, cube2.position.x);
			// console.log(cube.position.z, cube2.position.z);

			// console.log(angle, changeZ, changeX);
			angle = ( angle * 180 ) / Math.PI;
			if ( angle <= 5 && - 5 <= angle && changeZ >= 0 ) {

				if ( Math.sqrt( changeX * changeX + changeZ * changeZ ) <= 100 ) {

					infraredSensor =
            ( Math.sqrt( changeX * changeX + changeZ * changeZ ) / 70 ) * 100;
					document.getElementById( 'sensorValue' ).value =
            'Infrared  = On, value= ' +
            infraredSensor +
            'child' +
            i +
            'gyro ang' +
            gyroSensorTotalAngleRotation +
            '   ' +
            child.position.x +
            '   ' +
            child.position.z +
            ' ' +
            Math.floor( angle ) +
            cube2.position.x +
            '  ' +
            cube2.position.z;
					// } else {
					//   document.getElementById("sensorValue").value =
					//     "Infrared  = On, value= " +
					//     0 +
					//     "child" +
					//     i +
					//     "gyro ang" +
					//     gyroSensorTotalAngleRotation +
					//     "   " +
					//     child.position.x +
					//     "   " +
					//     child.position.z +
					//     " " +
					//     Math.floor(angle) +
					//     cube2.position.x +
					//     "  " +
					//     cube2.position.z;
					// }

				}

			}

		}
		// if (infraredSensorOn == true) {
		//   infraredSensorOn = false;
		//   document.getElementById("sensorValue").value = "Infrared Sensor = Off";
		// } else {
		//   infraredSensorOn = true;
		//   document.getElementById("sensorValue").value =
		//     "Infrared Sensor = On, Mode = Proximity ";
		//   var obj = cube;
		//   // console.log(xMax, cube.posistion.x, yMax, obj.posistion.y, yMin);

		//   if (
		//     obj.position.x <= xMin &&
		//     yMax >= obj.position.y &&
		//     obj.position.y >= 0 &&
		//     zMax >= obj.position.z &&
		//     obj.position.z >= zMin
		//   ) {
		//     // alert("I am an alert box!2");
		//     if (obj.position.x - xMin < 70) {
		//       // alert("I am an alert box!3");
		//       infraredSensor = (-(obj.position.x - xMin) / 70) * 100;
		//     }
		//   }
		//   document.getElementById("sensorValue").value =
		//     "Infrared Sensor = On, Mode = Proximity, Value " + infraredSensor;
		// }

	}

}
function colourSensorFunctionImage2() {

	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	var c = document.getElementById( 'canvas' );
	var ctx = c.getContext( '2d' );
	var imgData = ctx.getImageData( mouseX, mouseY, 1, 1 );
	console.log( ctx );
	var red = imgData.data[ 0 ];
	var green = imgData.data[ 1 ];
	var blue = imgData.data[ 2 ];

	var alpha = imgData.data[ 3 ];
	document.getElementById( 'Colour' ).innerHTML =
    'r:' + red.toFixed() + 'g:' + green.toFixed() + 'b:' + blue.toFixed();

}

function onDocumentMouseMove( event ) {

	// mouseX = event.clientX ;
	// mouseY = event.clientY ;

	mouseX = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouseY = - ( event.clientY / window.innerHeight ) * 2 + 1;

	// mouseX = event.clientX - windowHalfX;
	// mouseY = event.clientY - windowHalfY;
	// mouseZ = event.clientZ;

}
function colourSensorFunctionImage() {

	var read = new Float32Array( 4 );
	document.addEventListener( 'mousemove', onDocumentMouseMove, false );

	toScreenPosition( cube2, camera );
	renderer.readRenderTargetPixels( rtTexture, pixelX, pixelY, 1, 1, read );
	// renderer.readRenderTargetPixels(rtTexture, windowHalfX + mouseX, windowHalfY - 0.01 , 1, 1, read);
	//document.getElementById("Infrared").innerHTML = mouseX+ " "+  mouseY + " "+ pixelX + " "+ pixelY;
	// renderer.readRenderTargetPixels(
	//   rtTexture,
	//   windowHalfX + head.x,
	//   windowHalfY - mesh.position.y,
	//   1,
	//   1,
	//   read
	// );
	// console.log(windowHalfX + head.x, windowHalfY - mesh.position.y);
	// console.log(pixelX, pixelY);
	// console.log(mouseX, mouseY);
	console.log(
		'r:' +
      read[ 0 ].toFixed() +
      'g:' +
      read[ 1 ].toFixed() +
      'b:' +
      read[ 2 ].toFixed(),
	);
	//valueNode.innerHTML = 'r:' + read[ 0 ] + '<br/>g:' + read[ 1 ] + '<br/>b:' + read[ 2 ];
	document.getElementById( 'Colour' ).innerHTML =
    'r:' +
    read[ 0 ].toFixed() +
    'g:' +
    read[ 1 ].toFixed() +
    'b:' +
    read[ 2 ].toFixed();

}

function colourSensorFunctionImage3() {

	var imagedata = getImageData( imgTexture.image );
	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	toScreenPosition( cube2, camera );
	var x = pixelX.toFixed();
	var y = pixelY.toFixed();
	console.log( x, y );
	//var color = getPixel( imagedata, x, y);
	var color = getPixel( imagedata, - 1214, 299 );

	//console.log ( pixelX.toFixed(), pixelY.toFixed())

	document.getElementById( 'Colour' ).innerHTML =
    color.r + ' ' + color.g + ' ' + color.b;

}

function getImageData( image ) {

	var canvas = document.createElement( 'canvas' );
	canvas.width = image.width;
	canvas.height = image.height;

	var context = canvas.getContext( '2d' );
	context.drawImage( image, 0, 0 );

	return context.getImageData( 0, 0, image.width, image.height );

}

function getPixel( imagedata, x, y ) {

	var position = ( x + imagedata.width * y ) * 4,
		data = imagedata.data;
	// console.log(position, data, data[position], data[position+1], data[position+2])
	return {
		r: data[ position ],
		g: data[ position + 1 ],
		b: data[ position + 2 ],
		a: data[ position + 3 ],
	};

}

function toScreenPosition( obj, camera ) {

	var vector = new THREE.Vector3();

	var widthHalf = 0.5 * renderer.getContext().canvas.width;
	var heightHalf = 0.5 * renderer.getContext().canvas.height;

	obj.updateMatrixWorld();
	vector.setFromMatrixPosition( obj.matrixWorld );
	vector.project( camera );

	vector.x = vector.x * widthHalf + widthHalf;
	// vector.x = -4.463079645073373 * widthHalf + widthHalf;
	vector.y = - ( vector.z * heightHalf ) + heightHalf;
	// vector.y = -(vector.z * heightHalf) + heightHalf;

	pixelX = vector.x + 75;
	pixelY = vector.y + 300;

}
