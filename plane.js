/* eslint-disable no-undef */
/* eslint-disable padded-blocks */
var camera, renderer, mesh;
var meshFloor;
var robotMesh;
var x = 0;
var keyboard = {};
var player = { height: 1.8, speed: 0.2, turnSpeed: Math.PI * 0.02 };
var USE_WIREFRAME = false;
var ctx;
function init() {
	"use strict";

	Physijs.scripts.worker = "../LegoMindstorm/js/physijs_worker.js";
	Physijs.scripts.ammo = "../js/ammo.js";
	scene = new THREE.Scene();
	group = new THREE.Group();
	camera = new THREE.PerspectiveCamera( 90, 1280 / 720, 0.1, 1000 );

	camera.position.set( 0, 50, 0 );
	const color = 0xffffff;
	const intensity = 0.5;
	light = new THREE.AmbientLight( color, intensity );
	var light2 = new THREE.AmbientLight( 0x404040 );
	light.castShadow = true;

	scene.add( light );
	scene.add( light2 );
	clock = new THREE.Clock();
	raycaster = new THREE.Raycaster();
	mouse = new THREE.Vector2();

	camera.lookAt( new THREE.Vector3( 0, player.height, 0 ) );


	triangleGeometry = new THREE.Geometry();
	var z = Math.tan( ( 30 * Math.PI ) / 180 ) * 255;
	triangleGeometry.vertices.push( new THREE.Vector3( 0.0, 0, 0.0 ) );
	triangleGeometry.vertices.push( new THREE.Vector3( - 255.0,0 , - z ) );
	triangleGeometry.vertices.push( new THREE.Vector3( - 255.0, 0, z ) );
	triangleGeometry.faces.push( new THREE.Face3( 0, 1, 2 ) );

	var triangleMaterial = new THREE.MeshBasicMaterial( {
		color: 0x000000,
		side: THREE.DoubleSide,
	} );

	var triangleMesh = new THREE.Mesh( triangleGeometry, triangleMaterial );
	triangleMesh.position.set( - 1.5, 0.0, 4.0 );
	scene.add( triangleMesh );

	triangleGeometry2 = new THREE.Geometry();
	var z = Math.tan( ( 5 * Math.PI ) / 180 ) * 70;
	triangleGeometry2.vertices.push( new THREE.Vector3( 0.0, 5.0, 0.0 ) );
	triangleGeometry2.vertices.push( new THREE.Vector3( - 70.0, 5.0, - z ) );
	triangleGeometry2.vertices.push( new THREE.Vector3( - 70.0, 5.0, z ) );
	triangleGeometry2.faces.push( new THREE.Face3( 0, 1, 2 ) );

	var triangleMaterial = new THREE.MeshBasicMaterial( {
		color: 0x000000,
		side: THREE.DoubleSide,
	} );

	var triangleMesh = new THREE.Mesh( triangleGeometry2, triangleMaterial );
	triangleMesh.position.set( - 1.5, 0.0, 4.0 );
	scene.add( triangleMesh );

	triangleGeometry3 = new THREE.Geometry();
	var z = Math.tan( ( 25 * Math.PI ) / 180 ) * 200;
	triangleGeometry3.vertices.push( new THREE.Vector3( 0.0, 0.0, 0.0 ) );
	triangleGeometry3.vertices.push( new THREE.Vector3( - 200.0, 0.0, - z ) );
	triangleGeometry3.vertices.push( new THREE.Vector3( - 200.0, 0.0, z ) );
	triangleGeometry3.faces.push( new THREE.Face3( 0, 1, 2 ) );

	var triangleMaterial = new THREE.MeshBasicMaterial( {
		color: 0x000000,
		side: THREE.DoubleSide,
	} );

	var triangleMesh = new THREE.Mesh( triangleGeometry3, triangleMaterial );
	triangleMesh.position.set( - 1.5, 0.0, 4.0 );
	scene.add( triangleMesh );

	triangleGeometry4 = new THREE.Geometry();
	var z = Math.tan( ( 25 * Math.PI ) / 180 ) * 5;
	triangleGeometry4.vertices.push( new THREE.Vector3( 0.0, 0.0, 0.0 ) );
	triangleGeometry4.vertices.push( new THREE.Vector3( - 5.0, 0.0, - z ) );
	triangleGeometry4.vertices.push( new THREE.Vector3( - 5.0, 0.0, z ) );
	triangleGeometry4.faces.push( new THREE.Face3( 0, 1, 2 ) );

	var triangleMaterial = new THREE.MeshBasicMaterial( {
		color: 0x000000,
		side: THREE.DoubleSide,
	} );

	var triangleMesh = new THREE.Mesh( triangleGeometry4, triangleMaterial );
	triangleMesh.position.set( - 1.5, 0.0, 4.0 );
	scene.add( triangleMesh );

	var geometry = new THREE.BoxGeometry( 10, 10, 10 );
	material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
	cube = new THREE.Mesh( geometry, material );
	cube.position.x = - 40;
	cube.position.z = 5.968;
	group.add( cube );


	var geometry = new THREE.BoxGeometry( 10, 10, 10 );
	material = new THREE.MeshBasicMaterial( { color: 0x00ffff } );
	var cube3 = new THREE.Mesh( geometry, material );
	cube3.position.x = - 30;
	cube3.position.z = - 50;

	var geometry = new THREE.BoxGeometry( 10, 10, 10 );
	material = new THREE.MeshBasicMaterial( { color: 0xffffff } );
	var cube4 = new THREE.Mesh( geometry, material );
	cube4.position.x = 30;
	cube4.position.z = - 50;

	var geometry = new THREE.BoxGeometry( 10, 10, 10 );
	material = new THREE.MeshBasicMaterial( { color: 0x0000ff } );
	var cube5 = new THREE.Mesh( geometry, material );
	cube5.position.x = 40;
	cube5.position.z = 60;
	var geometry = new THREE.BoxGeometry( 10, 10, 10 );
	material = new THREE.MeshBasicMaterial( { color: 0x0000ff } );
	var cube6 = new THREE.Mesh( geometry, material );
	cube6.position.x = 100;
	cube6.position.z = 5;

	var geometry = new THREE.BoxGeometry( 1, 1, 1 );
	material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
	cube2 = new THREE.Mesh( geometry, material );

	cube2.position.y = 5;
	scene.add( cube2 );
	group.add( cube );
	group.add( cube3 );
	group.add( cube4 );
	group.add( cube5 );
	group.add( cube6 );

	scene.add( group );

	meshFloor = new THREE.Mesh(
		new THREE.PlaneGeometry( 1000, 1000, 1000, 1000 ),
		new THREE.MeshBasicMaterial( { color: 0x000000, wireframe: USE_WIREFRAME } )
	);
	meshFloor.receiveShadow = true;
	meshFloor.rotation.x -= Math.PI / 2; // Rotate the floor 90 degrees
	scene.add( meshFloor );

	renderer = new THREE.WebGLRenderer();
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.BasicShadowMap;

	renderer.setClearColor( 0xffffff );
	// renderer.setSize(1000, 520);
	// document.body.appendChild(renderer.domElement);

	renderer.setSize(
	  window.innerWidth - window.innerWidth / 3.5,
	  window.innerHeight - window.innerHeight / 7
	);
	document.body.appendChild( renderer.domElement );
	//THREE.WebGLRenderer.compile(scene, camera);
	//document.addEventListener("mousedown", onDocumentMouseDown, false);
	var loader = new THREE.TextureLoader();

	// Load an image file into a custom material
	// var material = new THREE.MeshLambertMaterial({
	//   map: loader.load(
	//     "https://s3.amazonaws.com/duhaime/blog/tsne-webgl/assets/cat.jpg"
	//   ),
	// });

	 imgTexture = THREE.ImageUtils.loadTexture( "/colour.jpg" );

	var material = new THREE.MeshBasicMaterial( { map: imgTexture } );
	// // Load an image file into a custom material
	// // var material = new THREE.MeshLambertMaterial({
	// // 	map: loader.load("/colour.jpg"),
	// // });

	// // create a plane geometry for the image with a width of 10
	// // and a height that preserves the image's aspect ratio
	var geometry = new THREE.PlaneGeometry( 300, 300 * 0.75 );

	// // // combine our image geometry and material into a mesh
	mesh = new THREE.Mesh( geometry, material );

	// // set the position of the image mesh in the x,y,z dimensions
	mesh.position.set( - 150, 0.02, 0 );

	// // add the image to the scene
	scene.add( mesh );
	mesh.rotateX( 4.71239 );

	rtTexture = new THREE.WebGLRenderTarget(
		window.innerWidth,
		window.innerHeight,
		{
			minFilter: THREE.LinearFilter,
			magFilter: THREE.NearestFilter,
			format: THREE.RGBAFormat,
			type: THREE.FloatType,
		}
	);

	triangle = new THREE.Triangle();

	var z = Math.tan( ( 30 * Math.PI ) / 180 ) * 255;

	triangle.a = new THREE.Vector3( 0, 5, 0 );
	triangle.b = new THREE.Vector3( - 255, 5, - z );
	triangle.c = new THREE.Vector3( - 255, 5, z );

//	scene.add( triangle );
	robot = "complexRobot";

	displayRobotSim();
	animate();
}

function displayRobotSim() {
	if ( robot == "complexRobot" ) {
		//alert("if condition");

		var loader = new THREE.GLTFLoader();
		loader.load( "LegoRobot/ComplexRobot.gltf", handle_load );
		// object;
		renderer.setClearColor( 0xffffff );
		function handle_load( gltf ) {
			object = gltf.scene.children[ 0 ];
			object.children[ 0 ].position.set( 0, 2.5, 0 );
			object.children[ 0 ].rotateX( 2 * Math.PI );
			//object.children[0].rotateY(-Math.PI / 2);
			object.children[ 0 ].scale.x = 0.06;
			object.children[ 0 ].scale.y = 0.06;
			object.children[ 0 ].scale.z = 0.06;
			object.children[ 0 ].receiveShadow = true;
			object.children[ 0 ].castShadow = true;
			body = object.children[ 0 ];
			scene.add( object.children[ 0 ] );
			//mesh.position, (z = -500);
			// var loader = new THREE.ObjectLoader();
			// loader.load("/LegoRobot/ComplexRobot.dae.json", function (object) {
			//   //group = new THREE.Group();

			//   //group.add(object);
			//   //group.Rotate(1.57);
			//   // robotMesh = object;

			//   object.children[0].position.set(0, 0, 10);
			//   object.rotateX(-Math.PI / 2);
			//   object.scale.x = 0.25;
			//   object.scale.y = 0.25;
			//   object.scale.z = 0.25;

			//   body = object;
			//   scene.add(object);
			// });

			var loader = new THREE.ObjectLoader();
			loader.load( "/LegoRobot/wheel.dae (1).json", function ( object2 ) {
				//group = new THREE.Group();

				//group.add(object);
				//group.Rotate(1.57);
				// robotMesh = object;

				// object2.children[0].position.set(0, 50, 100);
				object2.position.set( 8, 4.5, 19 );
				object2.rotateX( - Math.PI / 2 );

				object2.scale.x = 0.06;
				object2.scale.y = 0.06;
				object2.scale.z = 0.06;
				object2.receiveShadow = true;
				object2.castShadow = true;
				wheel = object2;

				scene.add( object2 );
			} );

			var loader = new THREE.ObjectLoader();
			loader.load( "/LegoRobot/wheel.dae (1).json", function ( object3 ) {
				//group = new THREE.Group();

				//group.add(object);
				//group.Rotate(1.57);
				// robotMesh = object;

				object3.position.set( - 3, 4.5, 19 );
				object3.rotateX( - Math.PI / 2 );
				object3.scale.x = 0.06;
				object3.scale.y = 0.06;
				object3.scale.z = 0.06;
				object3.receiveShadow = true;
				object3.castShadow = true;

				wheel2 = object3;

				scene.add( object3 );
			} );

			var loader = new THREE.ObjectLoader();
			loader.load( "/LegoRobot/wheel.dae (1).json", function ( object4 ) {
				//group = new THREE.Group();

				//group.add(object);
				//group.Rotate(1.57);
				// robotMesh = object;

				object4.position.set( - 14, 4.5, 19 );
				object4.rotateX( - Math.PI / 2 );
				object4.scale.x = 0.06;
				object4.scale.y = 0.06;
				object4.scale.z = 0.06;
				object4.receiveShadow = true;
				object4.castShadow = true;
				wheel3 = object4;

				scene.add( object4 );
			} );

			var loader = new THREE.ObjectLoader();
			loader.load( "/LegoRobot/wheel.dae (1).json", function ( object5 ) {
				//group = new THREE.Group();

				//group.add(object);
				//group.Rotate(1.57);
				// robotMesh = object;

				object5.position.set( 8, 4.5, - 8 );
				object5.rotateX( Math.PI / 2 );
				object5.scale.x = 0.06;
				object5.scale.y = 0.06;
				object5.scale.z = 0.06;
				object5.receiveShadow = true;
				object5.castShadow = true;
				wheel4 = object5;

				scene.add( object5 );
			} );
			var loader = new THREE.ObjectLoader();
			loader.load( "/LegoRobot/wheel.dae (1).json", function ( object6 ) {
				//group = new THREE.Group();

				//group.add(object);
				//group.Rotate(1.57);
				// robotMesh = object;

				object6.position.set( - 3, 4.5, - 8 );
				object6.rotateX( Math.PI / 2 );
				object6.scale.x = 0.06;
				object6.scale.y = 0.06;
				object6.scale.z = 0.06;
				object6.receiveShadow = true;
				object6.castShadow = true;
				wheel5 = object6;

				scene.add( object6 );
			} );

			var loader = new THREE.ObjectLoader();
			loader.load( "/LegoRobot/wheel.dae (1).json", function ( object7 ) {
				//group = new THREE.Group();

				//group.add(object);
				//group.Rotate(1.57);
				// robotMesh = object;

				object7.position.set( - 14, 4.5, - 8 );
				object7.rotateX( Math.PI / 2 );
				object7.scale.x = 0.06;
				object7.scale.y = 0.06;
				object7.scale.z = 0.06;
				object7.receiveShadow = true;
				object7.castShadow = true;
				wheel6 = object7;

				scene.add( object7 );
			} );
		}
	}
}

function onClick() {
	event.preventDefault();

	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

	raycaster.setFromCamera( mouse, camera );

	var intersects = raycaster.intersectObjects( scene.children, true );

	if ( intersects.length > 0 ) {
		if (
			intersects[ 0 ].point.x <= xMax &&
      intersects[ 0 ].point.x >= xMin &&
      intersects[ 0 ].point.y <= yMax &&
      intersects[ 0 ].point.y >= yMin &&
      intersects[ 0 ].point.z >= zMin &&
      intersects[ 0 ].point.z <= zMax
		) {
			console.log( "Intersection:", intersects[ 0 ], intersects[ 0 ].point.x );
			if ( confirm( "Do you want to Bump Sensor?" ) ) {
				touchSensor = "bumped";
				touchSensorFunction();
				// console.log("Thing was saved to the database.");
			} else {
				// Do nothing!
				if ( touchSensor == "released" ) {
					console.log( "dakhal" );
					touchSensor = "pressed";
					console.log( touchSensor );

					touchSensorFunction();
				} else {
					if ( touchSensor == undefined ) {
						console.log( "dakhal1" );
						touchSensor = "released";
						console.log( touchSensor );

						touchSensorFunction();
					} else {
						if ( touchSensor == "pressed" ) {
							touchSensor = "released";

							touchSensorFunction();
						} else {
							if ( touchSensor == "bumped" ) {
								touchSensor = "released";
								touchSensorFunction();
							}
						}
					}
				}
				console.log( "Thing was not saved to the database." );
			}
		} else {
			console.log(
				"no",
				intersects[ 0 ].point.x,
				intersects[ 0 ].point.y,
				intersects[ 0 ].point.z
			);
		}
	}
}

function animate() {
	//debugger;
	//ultrasonicSensorFunction();
	requestAnimationFrame( animate );

	if ( wheel != undefined ) {
		var position = new THREE.Vector3();
		body.getWorldPosition( position );
		robotX = position.x;
		robotY = position.y;
		robotZ = position.z;

		//document.addEventListener("mousedown", onMouseDown, false);
		renderer.domElement.addEventListener( "click", onClick, false );

		bbox = new THREE.Box3().setFromObject( body );
		xMin = bbox.min.x;
		xMax = bbox.max.x;
		yMin = bbox.min.y;
		yMax = bbox.max.y;
		zMin = bbox.min.z;
		zMax = bbox.max.z;

		//console.log(xMin, xMax, yMin, yMax, zMin, zMax);

		if ( itn == 1 ) {
			head = new THREE.Vector3( xMin, 5, ( zMax - zMin ) / 2 + zMin );
		}

		// head.x = xMin;
		// head.z = Math.sqrt((zMax - zMin) * (zMax - zMin)) / 2 + zMin;
		// head.x = wheel6.position.x - 10;
		// head.z = wheel6.position.z + 14;
		cube2.position.x = head.x;
		cube2.position.z = head.z;

		if ( itn == 1 ) {
			triangleGeometry.translate( cube2.position.x, 0, cube2.position.z );
			triangleGeometry2.translate( cube2.position.x, 0, cube2.position.z );
			triangleGeometry3.translate( cube2.position.x, 0, cube2.position.z );
			triangleGeometry4.translate( cube2.position.x, 0, cube2.position.z );
			triangle.a.x += cube2.position.x;
			triangle.a.z += cube2.position.z;
			triangle.b.x += cube2.position.x;
			triangle.b.z += cube2.position.z;
			triangle.c.x += cube2.position.x;
			triangle.c.z += cube2.position.z;

			console.log(triangle.a );
		console.log(triangle.b );
		console.log(triangle.c);

		console.log(triangleGeometry.vertices[0]);
		console.log(triangleGeometry.vertices[1]);
		console.log(triangleGeometry.vertices[2]);


		}
		itn += 1;

		simulation();

		camera.position.x = body.position.x;
		camera.position.z = body.position.z;
	}

	 document.getElementById( "function" ).innerHTML = simulation.toString();

	// Keyboard movement inputs6
	if ( keyboard[ 87 ] ) {
		// W key
		camera.position.x += Math.sin( camera.rotation.y ) * 4;
		camera.position.z += - Math.cos( camera.rotation.y ) * 4;
	}
	if ( keyboard[ 83 ] ) {
		// S key
		camera.position.x -= Math.sin( camera.rotation.y ) * 4;
		camera.position.z -= - Math.cos( camera.rotation.y ) * 4;
	}
	if ( keyboard[ 65 ] ) {
		// A key
		// Redirect motion by 90 degrees
		camera.position.x -= Math.sin( camera.rotation.y + Math.PI / 2 ) * 4;
		camera.position.z -= - Math.cos( camera.rotation.y + Math.PI / 2 ) * 4;
	}
	if ( keyboard[ 68 ] ) {
		// D key
		camera.position.x -= Math.sin( camera.rotation.y - Math.PI / 2 ) * 4;
		camera.position.z -= - Math.cos( camera.rotation.y - Math.PI / 2 ) * 4;
	}

	// Keyboard turn inputs
	if ( keyboard[ 37 ] ) {
		// left arrow key
		camera.rotation.y -= player.turnSpeed;
	}
	if ( keyboard[ 39 ] ) {
		// right arrow key
		camera.rotation.y += player.turnSpeed;
	}
	// if (canvas != null) {
	//   console.log("in");
	//   document.getElementById("Colour").innerHTML = "in";
	//   document.addEventListener("mousemove", onDocumentMouseMove, false);
	//   // var eventLocation = getEventLocation(can, e);
	//   var coord = "x=" + mouseX + ", y=" + mouseY;

	//   // Get the data of the pixel according to the location generate by the getEventLocation function
	//   var context = canvas.getContext("2d");
	//   var rect = canvas.getBoundingClientRect();
	//   var pixelData = context.getImageData(
	//     mouseX - rect.left,
	//     mouseY - rect.top,
	//     1,
	//     1
	//   ).data;

	//   // var gl = canvas.getContext("webgl");
	//   // var pixelValues = new Uint8Array(4);
	//   // gl.readPixels(mouseX, mouseY, 1, 1, gl.RGB, gl.UNSIGNED_BYTE, pixelValues);
	//   // console.log(pixelValues);
	//   // If transparency on the image
	//   if (
	//     pixelData[0] == 0 &&
	//     pixelData[1] == 0 &&
	//     pixelData[2] == 0 &&
	//     pixelData[3] == 0
	//   ) {
	//     coord += " (Transparent color detected, cannot be converted to HEX)";
	//   }

	//   var hex =
	//     "#" +
	//     ("000000" + rgbToHex(pixelData[0], pixelData[1], pixelData[2])).slice(-6);

	//   // Draw the color and coordinates.
	//   document.getElementById("Colour").innerHTML = pixelData + coord;
	//   // document.getElementById("Colour").innerHTML = coord;
	//   // document.getElementById("Colour").style.backgroundColor = hex;
	// } else {
	//   document.getElementById("Colour").innerHTML = "empty";
	//   // document.getElementById("Colour").style.backgroundColor = hex;
	// }

	render();

	// renderer.render(scene, camera);
}

function onDocumentMouseMove( event ) {
	event.preventDefault();
	mouseX = event.clientX;
	mouseY = event.clientY;
	// mouseX = (event.clientX / window.innerWidth) * 2 - 1;
	// mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
}

function render() {
	renderer.setRenderTarget( rtTexture );
	renderer.clear();
	renderer.render( scene, camera );

	renderer.setRenderTarget( null );
	renderer.render( scene, camera );

	// renderer.readRenderTargetPixels(
	//   rtTexture,
	//   head.x,
	//   mesh.position.y,
	//   1,
	//   1,
	//   read
	// );

	// console.log("r:" + read[0] + "<br/>g:" + read[1] + "<br/>b:" + read[2]);
}

function keyDown( event ) {
	keyboard[ event.keyCode ] = true;
}

function keyUp( event ) {
	keyboard[ event.keyCode ] = false;
}

window.addEventListener( "keydown", keyDown );
window.addEventListener( "keyup", keyUp );

window.onload = init;
