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
var GRID_SIZE = Game.GRID_SIZE;

// Game state
var player = {x: 4, y: 4};
var grid = [];
var dialogue = false;

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

	// Find the appropriate tilemap
	var layer = TileMaps.desert.layers[0];

	// Create the grid from the tilemap
	var h = layer.height;
	var w = layer.width;
	var map_data = layer.data;
	for(var i=0; i<h; ++i) {
		grid.push([]);

		for(var j=0; j<w; ++j) {
			(function() {

				var id = map_data[j + w*i];

				var is_wall;
				if(id == 46)
					is_wall = true;
				else
					is_wall = false;

				var tile = {
					is_solid: function() {return is_wall;},
					id: id
				};
				grid[i].push(tile);

			}());
		}
	}

	Game.loadImages(after_images_load(ctx));
};

var after_images_load = function(ctx) {

	return function() {
		// Register all the event listeners
		gameLoop(ctx)();
		document.body.addEventListener("keydown", keydown, false);
		document.body.addEventListener("keyup", keyup, false);
	};
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

var draw_tile = (function() {
	var tileset = TileMaps.desert.tilesets[0];
	var cols = tileset.columns;
	var s = tileset.spacing;
	var m = tileset.margin;
	var iw = tileset.tilewidth;
	var ih = tileset.tileheight;

	return function(ctx, id, x, y, w, h) {
		id = id-1;
		Game.drawImage(ctx, 'tiles.png',
		               s + (m+iw) * (id%cols), s + (m+ih) * Math.floor(id/cols),
		               iw, ih,
		               x, y,
		               w, h);
	};
}());

var onUpdate = function(elapsed) {
	var speed = 0.1 / GRID_SIZE;

	//player is not allowed to move while there is dialogue
	if(!dialogue) {
		if(keys[65]) //left
			player.x -= speed * elapsed;
		if(keys[64+4]) //right
			player.x += speed * elapsed;
		if(keys[64+23]) //up
			player.y -= speed * elapsed;
		if(keys[64+19]) //down
			player.y += speed * elapsed;
	}
	//for now, space turns off dialogue when its on.
	else if(keys[32]) {
		dialogue = false;
	}

	Game.collide(grid, player);
};

var draw = function(ctx) {
	// Draw the walls
	for(var i=0; i<grid.length; ++i) {
		for(var j=0; j<grid[i].length; ++j) {
			var tile = grid[i][j];
			var x = j*GRID_SIZE;
			var y = i*GRID_SIZE;
			draw_tile(ctx, tile.id, x, y, GRID_SIZE, GRID_SIZE);
		}
	}

	// Draw the player
	ctx.fillStyle = 'red';
	var PSIZE = Game.PLAYER_SIZE;
	ctx.fillRect(player.x * GRID_SIZE, player.y * GRID_SIZE, PSIZE, PSIZE);

	// Text Dialogue Boxes
	if(dialogue) {
		dialogueBox(ctx, "lsakjd fdsfsdj flkdsjflks kldsfjf fd jfdfd jfdd jdsks djfjdkfdkej", false);
	}
};

var dialogueBox = function(ctx, text, textOptions) {
	// values
	var LINEHEIGHT = 14;
	var WRAPWIDTH = 200;
	var FONT = "14px sans-serif";
	var BOXWIDTH = 400;
	var BOXHEIGHT = 200;
	var PADDING = 20;
	var bTextOptions = textOptions;
	
	ctx.font = FONT;
	ctx.fillStyle = 'gray';
	ctx.fillRect(WIDTH/2, HEIGHT/2, BOXWIDTH, BOXHEIGHT);
	ctx.fillStyle = 'black';
	wrapText(ctx, text, (WIDTH/2) + PADDING, HEIGHT/2 + PADDING, WRAPWIDTH, LINEHEIGHT)
};

function wrapText(context, text, x, y, maxWidth, lineHeight) {
	var words = text.split(' ');
	var line = '';

	for(var n = 0; n < words.length; n++) {
	  var testLine = line + words[n] + ' ';
	  var metrics = context.measureText(testLine);
	  var testWidth = metrics.width;
	  if (testWidth > maxWidth && n > 0) {
		context.fillText(line, x, y);
		line = words[n] + ' ';
		y += lineHeight;
	  }
	  else {
		line = testLine;
	  }
	}
	context.fillText(line, x, y);
}


}());
