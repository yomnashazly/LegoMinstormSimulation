( function () {

	function r( e, n, t ) {

		function o( i, f ) {

			if ( ! n[ i ] ) {

				if ( ! e[ i ] ) {

					var c = "function" == typeof require && require; if ( ! f && c ) return c( i, ! 0 ); if ( u ) return u( i, ! 0 ); var a = new Error( "Cannot find module '" + i + "'" ); throw a.code = "MODULE_NOT_FOUND", a;

				} var p = n[ i ] = { exports: {} }; e[ i ][ 0 ].call( p.exports, function ( r ) {

					var n = e[ i ][ 1 ][ r ]; return o( n || r );

				}, p, p.exports, r, e, n, t );

			} return n[ i ].exports;

		} for ( var u = "function" == typeof require && require, i = 0; i < t.length; i ++ )o( t[ i ] ); return o;

	} return r;

} )()( { 1: [ function ( require, module, exports ) {

	'use strict';

	const Polygon = require( './lib/polygon' );
	const PolygonArray = require( './lib/polygonArray' );
	const Edge = require( './lib/edge' ).Edge;
	const pointState = require( './lib/point' ).pointState;

	function intersection( poly1, poly2 ) {

		try {

			testInputValues( poly1, poly2 );

		} catch ( e ) {

			return e;

		}

		poly1 = new Polygon( poly1 );
		poly2 = new Polygon( poly2 );

		let result = isOnePolyInOther( poly1, poly2 );
		if ( result ) {

			return result;

		}

		let intersectPolies = new PolygonArray();
		intersectPolies.add( new Polygon() );

		let point;
		let elem;
		let edges = poly1.getEdges();

		for ( let edge of edges ) {

			point = edge.getStartPoint();
			findPointInPoly( point, poly2 );
			findEdgeIntersection( edge, poly2.getEdges() );

			if ( ! edge.getIntersectCount() ) {

				continue;

			}

			elem = getFirstIntersectElem( edge, point );
			if ( ! elem ) {

				continue;

			}

			addIntersectPoint( elem.point, poly2 );
			findNextIntersectPoint( edge );

		}

		return intersectPolies.getResult();


		function findNextIntersectPoint( edge ) {

			let poly = poly1.isEdgeExist( elem.edge ) ? poly2 : poly1;
			let ownPoly = ( poly === poly1 ) ? poly2 : poly1;

			let point1 = elem.edge.getStartPoint();
			let point2 = elem.edge.getEndPoint();
			poly.isPointInPoly( point1 );
			poly.isPointInPoly( point2 );

			let edgePart1 = new Edge( elem.point, point1 );
			let edgePart2 = new Edge( elem.point, point2 );

			let edges = [].slice.call( poly.getEdges() );
			reduceEdges( edges, edge );

			findEdgeIntersection( edgePart1, edges );
			findEdgeIntersection( edgePart2, edges );

			edgePart1.setState( point1.getState() );
			edgePart2.setState( point2.getState() );

			let nextStartPoint;
			let nextPart;
			if ( point1.getState() === pointState.outPoly && ( edgePart1.getIntersectCount() % 2 ) ||
            point1.getState() === ( pointState.inPoly || pointState.onEdge ) &&
            ! ( edgePart1.getIntersectCount() % 2 ) ) {

				nextStartPoint = point1;
				nextPart = edgePart1;

			} else {

				nextStartPoint = point2;
				nextPart = edgePart2;

			}
			if ( nextPart.getIntersectCount() ) {

				let element = getFirstIntersectElem( nextPart, elem.point );
				if ( element ) {

					edge = elem.edge;
					elem = element;
					addIntersectPoint( element.point, poly );
					return findNextIntersectPoint( edge );

				}

			}

			edges = [].slice.call( ownPoly.getEdges() );
			reduceEdges( edges, elem.edge );

			let nextEdge;
			for ( let edge of edges ) {

				if ( edge.isPointExist( nextStartPoint ) ) {

					nextEdge = edge;
					break;

				}

			}

			if ( ! nextEdge.getStartPoint().isCoordEqual( nextStartPoint ) ) {

				nextEdge.changePoints();

			}
			ownPoly.setDirection( elem.edge, nextEdge );

			for ( var i = 0; i < ownPoly.getEdges().length; i ++ ) {

				if ( i !== 0 ) {

					nextEdge = ownPoly.getNextEdge();

				}

				point = nextEdge.getStartPoint();
				findPointInPoly( point, poly );
				findEdgeIntersection( nextEdge, poly.getEdges() );

				if ( ! nextEdge.getIntersectCount() ) {

					continue;

				}

				elem = getFirstIntersectElem( nextEdge, point );
				if ( ! elem ) {

					return;

				}

				addIntersectPoint( elem.point, poly );
				return findNextIntersectPoint( nextEdge );

			}

		}


		function addIntersectPoint( point, poly ) {

			if ( point.getState() === pointState.undefined ) {

				poly.isPointInPoly( point );

			}
			let intersectPoly = intersectPolies.getLast();
			if ( intersectPoly.isIntersectionEnd() ) {

				intersectPolies.add( new Polygon() );

			}
			intersectPoly.addPoint( point );

		}

		function findPointInPoly( point, poly ) {

			if ( point.compare( intersectPolies.getPoints() ) && poly.isPointInPoly( point ) ) {

				addIntersectPoint( point, poly );

			}

		}

		function getFirstIntersectElem( edge, point ) {

			let intersections = edge.getIntersectElements();
			intersections = intersections.filter( intersect =>
				intersect.point.compare( intersectPolies.getPoints() ) );
			if ( ! intersections.length ) {

				intersectPolies.getLast().endIntersection();
				return false;

			}

			edge.setState( point.getState() );

			if ( intersections.length > 1 ) {

				intersections.forEach( intersect => intersect.point.calcDistance( point ) );
				intersections.sort( ( a, b ) => a.point.distance - b.point.distance );

			}
			return intersections[ 0 ];

		}

	}


	function testInputValues( poly1, poly2 ) {

		if ( ! Array.isArray( poly1 ) || ! Array.isArray( poly2 ) ) {

			throw new TypeError( 'Both of input values must be an array' );

		} else if ( poly1.length < 3 || poly2.length < 3 ) {

			throw new RangeError( 'Lengths of input values must be greater than two' );

		}

	}

	function isOnePolyInOther( poly1, poly2 ) {

		let countPointsIn;
		for ( let poly of [ poly1, poly2 ] ) {

			let secondPoly = ( poly === poly1 ) ? poly2 : poly1;
			countPointsIn = poly.calcPointsInPoly( secondPoly );
			if ( countPointsIn === poly.getPoints().length ) {

				return poly.getPointsResult();

			} else if ( countPointsIn ) {

				break;

			}

		}
		return false;

	}

	function findEdgeIntersection( edge, edges ) {

		if ( edge.getIntersectElements().length ) {

			return;

		}
		let intersectPoint;
		edges.forEach( intersectEdge => {

			intersectPoint = edge.findIntersectingPoint( intersectEdge );
			if ( intersectPoint.toString() === 'Point' ) {

				edge.addIntersectElement( intersectEdge, intersectPoint );

			}

		} );

	}

	function reduceEdges( edges, edge ) {

		let index = edges.indexOf( edge );
		if ( index + 1 ) {

			edges.splice( index, 1 );

		}
		return edges;

	}

	module.exports = intersection;

}, { "./lib/edge": 2, "./lib/point": 3, "./lib/polygon": 4, "./lib/polygonArray": 5 } ], 2: [ function ( require, module, exports ) {

	'use strict';

	const Point = require( './point' ).Point;
	const pointState = require( './point' ).pointState;

	const edgeState = {
		undefined: 0,
		outOut: 1,
		outIn: 2,
		inOut: 3,
		inIn: 4
	};

	class Edge {

		constructor( point1, point2 ) {

			this._p1 = point1;
			this._p2 = point2;
			this._state = edgeState.undefined;
			this._intersectElements = [];
			this._intersectCount = 0;

		}
		getStartPoint() {

			return this._p1;

		}
		getEndPoint() {

			return this._p2;

		}
		changePoints() {

			let temp = this._p1;
			this._p1 = this._p2;
			this._p2 = temp;

		}
		isPointExist( point ) {

			return ( this._p1.x === point.x && this._p1.y === point.y ) ||
            ( this._p2.x === point.x && this._p2.y === point.y );

		}
		setState( pState ) {

			switch ( pState ) {

				case pointState.outPoly:
					this._state = ( this._intersectCount % 2 ) ? edgeState.outIn : edgeState.outOut;
					break;
				case pointState.inPoly:
				case pointState.onEdge:
					this._state = ( this._intersectCount % 2 ) ? edgeState.inOut : edgeState.inIn;
					break;

			}

		}
		getState() {

			return this._state;

		}
		getIntersectElements() {

			return this._intersectElements;

		}
		addIntersectElement( edge, point ) {

			this._intersectCount ++;
			this._intersectElements.push( { edge: edge, point: point } );

		}
		getIntersectCount() {

			return this._intersectCount;

		}
		isIntersectHorizontalRayPoint( point ) {

			return point.y >= this._p1.y && point.y < this._p2.y ||
            point.y >= this._p2.y && point.y < this._p1.y;

		}
		getIntersectionRayX( point ) {

			return ( this._p2.x - this._p1.x ) * ( point.y - this._p1.y ) /
            ( this._p2.y - this._p1.y ) + this._p1.x;

		}
		findIntersectingPoint( edge ) {

			const divider = ( edge._p2.y - edge._p1.y ) * ( this._p2.x - this._p1.x ) -
            ( edge._p2.x - edge._p1.x ) * ( this._p2.y - this._p1.y );
			const numerA = ( edge._p2.x - edge._p1.x ) * ( this._p1.y - edge._p1.y ) -
            ( edge._p2.y - edge._p1.y ) * ( this._p1.x - edge._p1.x );
			const numerB = ( this._p2.x - this._p1.x ) * ( this._p1.y - edge._p1.y ) -
            ( this._p2.y - this._p1.y ) * ( this._p1.x - edge._p1.x );

			if ( ! divider || ( ! numerA && ! numerB ) ) {

				return false;

			}

			const uA = numerA / divider;
			const uB = numerB / divider;

			if ( uA < 0 || uA > 1 || uB < 0 || uB > 1 ) {

				return false;

			}
			const x = Math.round( ( this._p1.x + uA * ( this._p2.x - this._p1.x ) ) * 100 ) / 100;
			const y = Math.round( ( this._p1.y + uA * ( this._p2.y - this._p1.y ) ) * 100 ) / 100;

			return new Point( x, y );

		}

	}

	exports.Edge = Edge;
	exports.edgeState = edgeState;

}, { "./point": 3 } ], 3: [ function ( require, module, exports ) {

	'use strict';

	const pointState = {
		undefined: 0,
		outPoly: 1,
		inPoly: 2,
		onEdge: 3
	};

	class Point {

		constructor( x, y ) {

			this.x = x;
			this.y = y;
			this.distance = 0;
			this._state = pointState.undefined;

		}
		toString() {

			return 'Point';

		}
		setState( value ) {

			this._state = value;

		}
		getState() {

			return this._state;

		}
		calcDistance( point ) {

			this.distance = Math.sqrt( Math.pow( point.x - this.x, 2 ) + Math.pow( point.y - this.y, 2 ) );
			this.distance = Math.round( this.distance * 100 ) / 100;

		}
		valueOf() {

			return { x: this.x, y: this.y };

		}
		isCoordEqual( point ) {

			return this.x === point.x && this.y === point.y;

		}
		compare( value ) {

			if ( Array.isArray( value ) && value.length ) {

				for ( var point of value ) {

					if ( this.isCoordEqual( point ) ) {

						return false;

					}

				}

			} else if ( value.toString() === 'Point' ) {

				if ( this.isCoordEqual( value ) ) {

					return false;

				}

			}
			return true;

		}

	}

	exports.Point = Point;
	exports.pointState = pointState;

}, {} ], 4: [ function ( require, module, exports ) {

	'use strict';

	const Edge = require( './edge' ).Edge;
	const Point = require( './point' ).Point;
	const pointState = require( './point' ).pointState;
	const direction = {
		backward: 0,
		forward: 1
	};

	class Polygon {

		constructor( arrPoints ) {

			if ( ! Array.isArray( arrPoints ) || ! arrPoints.length ) {

				arrPoints = [];

			}
			this._points = arrPoints.map( item => new Point( item.x, item.y ) );
			this._edges = this._points.map( ( item, i, arr ) => {

				return new Edge( item, arr[ ( i + 1 ) % arr.length ] );

			} );
			this._edgesIndex = 0;
			this._direction = direction.forward;
			this._intersectionEnd = false;

		}
		isIntersectionEnd() {

			return this._intersectionEnd;

		}
		endIntersection() {

			this._intersectionEnd = true;

		}
		getEdges() {

			return this._edges;

		}
		getNextEdge() {

			if ( this._direction === direction.backward ) {

				this._edgesIndex = ( -- this._edgesIndex < 0 ) ? this._edges.length - 1 : this._edgesIndex;

			} else {

				this._edgesIndex = ++ this._edgesIndex % this._edges.length;

			}
			return this._edges[ this._edgesIndex ];

		}
		isEdgeExist( edge ) {

			return this._edges.indexOf( edge ) + 1;

		}
		setDirection( intersectEdge, nextEdge ) {

			let ind1 = this._edges.indexOf( intersectEdge );
			let ind2 = this._edges.indexOf( nextEdge );
			this._edgesIndex = ind2;
			this._direction = ( ind2 % ( this._edges.length - 1 ) <= ind1 ) ? direction.backward :
				direction.forward;

		}
		getPoints() {

			return this._points;

		}
		isPointsOnEdgesAndOut() {

			for ( let point of this._points ) {

				if ( point.getState() !== pointState.outPoly &&
                point.getState() !== pointState.onEdge ) {

					return false;

				}

			}
			return true;

		}
		getPointsResult() {

			return this._points.map( point => point.valueOf() );

		}
		addPoint( point ) {

			this._points.push( point );

		}
		isPointExist( point ) {

			return this._points.indexOf( point ) + 1;

		}
		calcPointsInPoly( poly ) {

			let count = 0;
			this._points.forEach( point => {

				if ( poly.isPointInPoly( point ) ) {

					count ++;

				}

			} );
			return count;

		}
		isPointInPoly( point ) {

			let isIn = false;
			let intersectX;
			this._edges.forEach( edge => {

				if ( edge.isIntersectHorizontalRayPoint( point ) ) {

					intersectX = edge.getIntersectionRayX( point );
					if ( point.x === intersectX ) {

						point.setState( pointState.onEdge );

					}
					isIn = ( point.x <= intersectX ) ? ! isIn : isIn;

				}

			} );
			if ( point.getState() === pointState.undefined ) {

				point.setState( isIn ? pointState.inPoly : pointState.outPoly );

			}
			return isIn;

		}

	}

	module.exports = Polygon;

}, { "./edge": 2, "./point": 3 } ], 5: [ function ( require, module, exports ) {

	'use strict';

	class PolygonArray {

		constructor() {

			this._polygons = [];

		}
		add( poly ) {

			this._polygons.push( poly );

		}
		getLast() {

			return this._polygons[ this.getLength() - 1 ];

		}
		getLength() {

			return this._polygons.length;

		}
		getPoints() {

			let points = this._polygons.map( poly => poly.getPoints() );
			return [].concat( ...points );

		}
		getResult() {

			this._polygons = this._polygons.filter( poly => {

				return poly.getPoints().length && ! poly.isPointsOnEdgesAndOut();

			} );
			if ( ! this._polygons.length ) {

				return this._polygons;

			}
			let points = this._polygons.map( poly => poly.getPointsResult() );
			return ( points.length > 1 && this.getLast().getPoints().length ) ? points :
				[].concat( ...points );

		}

	}

	module.exports = PolygonArray;

}, {} ], 6: [ function ( require, module, exports ) {

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

		// if (colourSensorOn == true) {
		//   document.getElementById("sensorValue").value = "Colour Sensor = Off";
		//   colourSensorOn = false;
		// } else {
		//colourSensorOn = true;
		// if (document.getElementById("colour")) {
		//   document.getElementById("sensorValue").value =
		//     "Colour Sensor = On, Mode = Colour";

		//  // var obj = cube;
		//   // console.log(xMax, cube.posistion.x, yMax, obj.posistion.y, yMin);

		//   if (
		//     obj.position.x <= xMin &&
		//     yMax >= obj.position.y &&
		//     obj.position.y >= 0 &&
		//     zMax >= obj.position.z &&
		//     obj.position.z >= zMin
		//   ) {
		//     colourSensor = material.color.getHexString();
		//   }
		//   document.getElementById("sensorValue").value =
		//     "Colour Sensor = On, Mode = Colour, Value = " + colourSensor;
		// }
		var value = new Array( group.children.length );

		for ( var i = 0; i < group.children.length; i ++ ) {

			var child = group.children[ i ];
			var isInside = pointIsInPoly( child.position, triangleGeometry4 );
			// if (isInside == false) {
			//   document.getElementById("sensorValue").value =
			//     "Infrared  = On, value= " + 0;
			// }
			if ( isInside == true ) {

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
	function ultrasonicSensorFunction4() {

		var value = new Array( group.children.length );

		for ( var i = 0; i < group.children.length; i ++ ) {

			var child = group.children[ i ];
			//	var isInside = pointIsInPoly( child.position, triangleGeometry );
			//var isInside = pointIsInPoly2( child, triangleGeometry );
			// if (isInside == false) {
			//   document.getElementById("sensorValue").value =
			//     "Infrared  = On, value= " + 0;

			//console.log(child.position);\
			if ( i == 0 ) {

				var box = new THREE.Box3();

				child.geometry.computeBoundingBox();


				box.copy( child.geometry.boundingBox ).applyMatrix4( mesh.matrixWorld );
				var box1 = new THREE.BoxHelper( child, 0x000000 );
				scene.add( box1 );

				console.log( box.intersectsTriangle( triangle ) );

				// }
				if ( box.intersectsTriangle( triangle ) ) {

					console.log( triangle.a );
					console.log( triangle.b );
					console.log( triangle.c );
					console.log( "child " + child.position.x + child.position.z );

					// console.log( box.intersectsTriangle( triangle ) );
					// console.log(box.distanceToPoint(cube2.position));
					// console.log (triangle.a);
					// console.log (box.min);
					// console.log (box.max);
					// var changeX = child.position.x - cube2.position.x;
					// var changeZ = child.position.z - cube2.position.z;
					// ultrasonicSensor = Math.sqrt( changeX * changeX + changeZ * changeZ );
					ultrasonicSensor = box.distanceToPoint( cube2.position );
					document.getElementById( 'Ultrasonic' ).innerHTML =
        'Ultrasonic Sensor = On, value= ' + ultrasonicSensor + ' ' + i;

					value[ i ] = true;

				} else {

					value[ i ] = false;

				}

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



	function ArePolygonsOverlapped( poly1, poly2 ) {

		if ( poly1.length >= 3 && poly2.length >= 3 ) {

			//close polygons
			poly1.push( poly1[ 0 ] );
			poly2.push( poly2[ 0 ] );

			for ( var i = 0; i < poly1.length - 1; i ++ ) {

				for ( var k = 0; k < poly2.length - 1; k ++ ) {

					if ( SimplePolylineIntersection( poly1[ i ], poly1[ i + 1 ], poly2[ k ], poly2[ k + 1 ] ) != null )
						return true;

				}

			}

			return false;

		}

		return null;

	}

	function SimplePolylineIntersection( latlong1, latlong2, latlong3, latlong4 ) {

		//Line segment 1 (p1, p2)
		var A1 = latlong2.Latitude - latlong1.Latitude;
		var B1 = latlong1.Longitude - latlong2.Longitude;
		var C1 = A1 * latlong1.Longitude + B1 * latlong1.Latitude;

		//Line segment 2 (p3,  p4)
		var A2 = latlong4.Latitude - latlong3.Latitude;
		var B2 = latlong3.Longitude - latlong4.Longitude;
		var C2 = A2 * latlong3.Longitude + B2 * latlong3.Latitude;

		var determinate = A1 * B2 - A2 * B1;

		var intersection;
		if ( determinate != 0 ) {

			var x = ( B2 * C1 - B1 * C2 ) / determinate;
			var y = ( A1 * C2 - A2 * C1 ) / determinate;

			var intersect = new VELatLong( y, x );

			if ( inBoundedBox( latlong1, latlong2, intersect ) &&
inBoundedBox( latlong3, latlong4, intersect ) )
				intersection = intersect;
			else
				intersection = null;

		} else //lines are parrallel
			intersection = null;

		return intersection;

	}

	//latlong1 and latlong2 represent two coordinates that make up the bounded box
	//latlong3 is a point that we are checking to see is inside the box
	function inBoundedBox( latlong1, latlong2, latlong3 ) {

		var betweenLats;
		var betweenLons;

		if ( latlong1.Latitude < latlong2.Latitude )
			betweenLats = ( latlong1.Latitude <= latlong3.Latitude &&
latlong2.Latitude >= latlong3.Latitude );
		else
			betweenLats = ( latlong1.Latitude >= latlong3.Latitude &&
latlong2.Latitude <= latlong3.Latitude );

		if ( latlong1.Longitude < latlong2.Longitude )
			betweenLons = ( latlong1.Longitude <= latlong3.Longitude &&
latlong2.Longitude >= latlong3.Longitude );
		else
			betweenLons = ( latlong1.Longitude >= latlong3.Longitude &&
latlong2.Longitude <= latlong3.Longitude );

		return ( betweenLats && betweenLons );

	}
	function ultrasonicSensorFunction() {

		var polygonsIntersect = require( 'polygons-intersect' );
		var poly1 = [ { x: 10, y: 10 }, { x: 10, y: 30 }, { x: 30, y: 30 }, { x: 30, y: 10 } ];
		var poly2 = [ { x: 20, y: 20 }, { x: 20, y: 40 }, { x: 40, y: 40 }, { x: 40, y: 20 } ];
		console.log( polygonsIntersect( poly1, poly2 ) );

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
			var isInside = pointIsInPoly( child.position, triangleGeometry2 );
			// if (isInside == false) {
			//   document.getElementById("sensorValue").value =
			//     "Infrared  = On, value= " + 0;
			// }
			if ( isInside == true ) {

				value[ i ] = true;
				var changeX = child.position.x - cube2.position.x;
				var changeZ = child.position.z - cube2.position.z;
				infraredSensor =
        ( Math.sqrt( changeX * changeX + changeZ * changeZ ) / 70 ) * 100;
				document.getElementById( 'Infrared' ).innerHTML =
        'Infrared  = On, value= ' + infraredSensor;

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
    'Infrared Sensor = On, Value = ' + infraredSensor;

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

}, { "polygons-intersect": 1 } ] }, {}, [ 6 ] );
