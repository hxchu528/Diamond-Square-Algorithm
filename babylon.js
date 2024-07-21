<!DOCTYPE html>
<html>
<head>
    <title>Babylon.js Sphere using Ribbon</title>
    <script src="https://cdn.babylonjs.com/babylon.js"></script>
</head>
<body>
    <canvas id="renderCanvas" style="width: 100%; height: 100%;"></canvas>
    <script ></script>
</body>
<script>
function map(n,or1,or2,r1,r2){return r1+(r2-r1)*((n-or1)/(or2-or1));}
function minmax(arr){
	var mins = arr[0][0];
	var maxs = arr[0][0];
	for(var i = 0; i<arr.length; i++){
		for(var j = 0; j<arr.length; j++){
			if(mins>arr[i][j]){mins=arr[i][j]}
			if(maxs<arr[i][j]){maxs=arr[i][j]}
		}
	}
	return [mins,maxs];
}
function randint(a,b){
	if(a>b){[a,b]=[b,a];}
	return Math.round(Math.random()*(b-a));
}
function set(size){
	var arr = [];
	for(var i = 0; i<2**size+1; i++){
		arr.push([]);
		for(var j = 0; j<2**size+1; j++){
			arr[i].push(null);
		}
	}
	return arr;
}
function gen(arr){
	for(var i = 0; i<arr.length; i++){
		arr[0][i]=0;
		arr[arr.length-1][i]=0;
	}
	var size = arr.length-1;
	var h = 50;
	while(size>1){
		for(var j = 0; j<arr.length-1; j+=size){
			for(var k = 0; k<arr.length-1; k+=size){
				var tl = arr[j][k];
				var tr = arr[j][k+size];
				var bl = arr[j+size][k];
				var br = arr[j+size][k+size];
				arr[j+size/2][k+size/2]=arr[j+size/2][k+size/2]!==null?arr[j+size/2][k+size/2]:Math.round((tl+tr+bl+br)/4+(Math.random()*h-h/2));
			}
		}
		for(var j = 0; j<=arr.length-1; j+=size/2){
			for(var k = 0; k<=arr.length-1; k+=size/2){
				if(arr[j][k]===null){
					var t = j-size/2<0?arr[arr.length-1+(j-size/2)][k]:arr[j-size/2][k];
					var b = j+size/2>arr.length-1?arr[j+size/2-arr.length+1][k]:arr[j+size/2][k];
					var l = k-size/2<0?arr[j][arr.length-1+(k-size/2)]:arr[j][k-size/2];
					var r = k+size/2>arr.length-1?arr[j][k+size/2-arr.length+1]:arr[j][k+size/2];
					if(arr[j][k]===null){
						if(k==arr.length-1){arr[j][k]=arr[j][0];}
						else if(j==arr.length-1){arr[j][k]=arr[0][k];}
						else{arr[j][k] = Math.round([t,b,l,r].reduce((a,i)=>a+(i!==null?i:0),0)/4+(Math.random()*h-h/2));}
					}
				}
			}
		}
		h/=2;
		size/=2;
	}
	return arr;
}
var a = gen(set(8));
var m = minmax(a);
for(var i = 0; i<a.length; i++){
	for(var j = 0; j<a.length; j++){
		a[i][j] = map(a[i][j],m[0],m[1],1,2);
	}
}
window.addEventListener('DOMContentLoaded', function() {
    // Get the canvas element
    var canvas = document.getElementById('renderCanvas');

    // Generate the Babylon.js 3D engine
    var engine = new BABYLON.Engine(canvas, true);

    // Create the scene
    var createScene = function() {
        var scene = new BABYLON.Scene(engine);

        // Create a camera and set its position
        var camera = new BABYLON.ArcRotateCamera('camera1', -Math.PI / 2, Math.PI / 2.5, 10, new BABYLON.Vector3(0, 0, 0), scene);
        camera.attachControl(canvas, true);

        // Add a light to the scene
        var light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(1, 1, 0), scene);
        light.intensity = 0.7;

		// Sphere parameters
		var latitudeBands = 90;
		var longitudeBands = 90;
		var radius = 1;
		// Vertex positions and indices arrays
		var positions = [];
		var indices = [];
		var normals = [];
		var uvs = [];
		// Generate positions, normals, and uvs
		for (var latNumber = 0; latNumber <= latitudeBands; latNumber++) {
			var theta = latNumber * Math.PI / latitudeBands;
			var sinTheta = Math.sin(theta);
			var cosTheta = Math.cos(theta);
			for (var longNumber = 0; longNumber <= longitudeBands; longNumber++) {
				var phi = longNumber * 2 * Math.PI / longitudeBands;
				var sinPhi = Math.sin(phi);
				var cosPhi = Math.cos(phi);
				var x = cosPhi * sinTheta * a[Math.floor(map(latNumber,0,latitudeBands,0,a.length-1))][Math.floor(map(longNumber,0,longitudeBands,0,a.length-1))];
				var y = cosTheta * a[Math.floor(map(latNumber,0,latitudeBands,0,a.length-1))][Math.floor(map(longNumber,0,longitudeBands,0,a.length-1))];
				var z = sinPhi * sinTheta * a[Math.floor(map(latNumber,0,latitudeBands,0,a.length-1))][Math.floor(map(longNumber,0,longitudeBands,0,a.length-1))];
				var u = 1 - (longNumber / longitudeBands);
				var v = 1 - (latNumber / latitudeBands);
				normals.push(x,y,z);
				uvs.push(u,v);
				positions.push(radius * x,radius * y,radius * z);
			}
		}
		// Generate indices
		for (var latNumber = 0; latNumber < latitudeBands; latNumber++) {
			for (var longNumber = 0; longNumber < longitudeBands; longNumber++) {
				var first = (latNumber * (longitudeBands + 1)) + longNumber;
				var second = first + longitudeBands + 1;
				indices.push(first, second, first + 1, second, second + 1, first + 1);
			}
		}
		// Create the custom sphere
		var customSphere = new BABYLON.Mesh("customSphere", scene);
		var vertexData = new BABYLON.VertexData();
		vertexData.positions = positions;
		vertexData.indices = indices;
		vertexData.normals = normals;
		vertexData.uvs = uvs;
		vertexData.applyToMesh(customSphere);
        return scene;
    }

    // Create the scene
    var scene = createScene();

    // Run the render loop
    engine.runRenderLoop(function() {
        scene.render();
    });

    // Resize the engine when the window is resized
    window.addEventListener('resize', function() {
        engine.resize();
    });
});
</script>
</html>
