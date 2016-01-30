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

var x = 100, y = 100;

var onUpdate = function(elapsed) {
	if(keys[65]) //left
		x--;
	if(keys[64+4]) //right
		x++;
	if(keys[64+23]) //up
		y--;
	if(keys[64+19]) //down
		y++;
};

var draw = function(ctx) {
	ctx.fillText('blah',x,y);
};


}());
