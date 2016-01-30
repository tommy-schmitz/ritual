(function() {


// Polyfill for animation frames
window.requestAnimationFrame = window.requestAnimationFrame ||
	function(_callback) {
		return window.setTimeout(function() {
			_callback(Date.now());
		},1);
	};
window.cancelAnimationFrame = window.cancelAnimationFrame ||
	function(_frame) {
		return window.clearTimeout(_frame);
	};

var WIDTH = 640;
var HEIGHT = 480;
var GRID_SIZE = 32;

window.onload = function() {
	var c = document.getElementById("myCanvas");

	c.setAttribute('width', WIDTH);
	c.setAttribute('height', HEIGHT);
	
	var ctx = c.getContext("2d");

/*
	ctx.mozImageSmoothingEnabled = false;
	ctx.webkitImageSmoothingEnabled = false;
	ctx.msImageSmoothingEnabled = false;
	ctx.imageSmoothingEnabled = false;
*/

	ctx.fillText("Hello", 50, 50);

	gameLoop(ctx)();
	document.body.addEventListener("keydown", keydown, false);
	document.body.addEventListener("keyup", keyup, false);
};

var keys = {};

var keydown = function(ke) {
	if(ke.keyCode >= 32 && ke.keyCode <= 127)
		keys[ke.keyCode] = true;
};

var keyup = function(ke) {
	if(ke.keyCode >= 32 && ke.keyCode <= 127)
		keys[ke.keyCode] = false;
};

var gameLoop = function(ctx) {
	var accum = 0;
	var lastFrameTime = null;
	var f = function(_timestamp) {
		var elapsed;
		if (lastFrameTime) {
			elapsed = _timestamp - lastFrameTime;
			fps = 1000/elapsed;
			accum += elapsed;
			var FRAME_TIME = 10;
			accum = Math.min(accum, 500);
			while(accum >= FRAME_TIME) {
				accum -= FRAME_TIME;
				onUpdate(FRAME_TIME);
			}
			ctx.clearRect(0,0,640,480);
			draw(ctx);
		}
		lastFrameTime = _timestamp;

		window.requestAnimationFrame(f);
	};
	return f;
};

// Game state
var player = {x: 4, y: 4};
var grid = [];

// Initialize the grid (initially completely empty)
for(var i=0; i<10; ++i) {
	grid.push([]);
	for(var j=0; j<10; ++j) {
		// Create a tile
		var tile = {
			is_solid: function() {return false;}
		};

		// Insert the tile into the grid
		grid[i].push(tile);
	}
}

// Add a few walls to the grid
var wall = function(j,i) {grid[i][j].is_solid = function() {return true;};};
wall(6, 6);
wall(6, 5);
wall(5, 6);
//Put walls around the edge of the grid
for(var j=0; j<grid[0].length; ++j) {
	wall(j, 0);
	wall(j, grid.length-1);
}
for(var i=0; i<grid.length; ++i) {
	wall(0, i);
	wall(grid[i].length-1, i);
}

var onUpdate = function(elapsed) {
	var speed = 2/GRID_SIZE;

	if(keys[65]) //left
		player.x -= speed;
	if(keys[64+4]) //right
		player.x += speed;
	if(keys[64+23]) //up
		player.y -= speed;
	if(keys[64+19]) //down
		player.y += speed;

	Game.collide(grid, player);
};

var draw = function(ctx) {
	ctx.fillStyle = 'red';
	ctx.fillRect(player.x * GRID_SIZE, player.y * GRID_SIZE, 24, 24);

	// Draw the walls
	for(var i=0; i<grid.length; ++i) {
		for(var j=0; j<grid[i].length; ++j) {
			if(grid[i][j].is_solid()) {
				var x = j*GRID_SIZE;
				var y = i*GRID_SIZE;
				ctx.fillStyle = 'black';
				ctx.fillRect(x, y, GRID_SIZE, GRID_SIZE);
			}
		}
	}
};


}());
