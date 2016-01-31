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

var progression = [
	[
		{npc: 4},
		{npc: 14},
	]
];
var curr_progression = 0;

// Game state
var player = {x: 4, y: 4};
var grid = [];
var dialogue = false;
var shelf = [];
var inventory = [];

var boss;
var npcs = [];

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

	// Create the grid from the tilemap
	var layer = TileMaps.desert.layers[0];
	var tileset = TileMaps.desert.tilesets[1];
	var h = layer.height;
	var w = layer.width;
	var map_data = layer.data;
	for(var i=0; i<h; ++i) {
		grid.push([]);

		for(var j=0; j<w; ++j) {
			(function() {

				var id = map_data[j + w*i] - tileset.firstgid;

				var is_wall = false;
				if(tileset.tileproperties[id] === undefined)
					tileset.tileproperties[id] = {};
				if(tileset.tileproperties[id].Solid !== undefined)
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

	// Find NPC positions in the tilemap
	var layer_npc = TileMaps.desert.layers[1];
	var firstgid = TileMaps.desert.tilesets[0].firstgid;
	var npc_data = layer_npc.data
	for(var i=0; i<h; ++i) {
		for(var j=0; j<w; ++j) {
			var id = npc_data[j + w*i] - firstgid;
			var x = j;
			var y = i;

			if(id === -firstgid) //nobody
				continue;
			else if(id === 3) //boss
				boss = {x: x, y: y};
			else if(id < firstgid+24) //npc
				npcs.push({id: id, x: x, y: y});
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

var is_near = function(a1, a2, radius) {
	if(radius === undefined)
		radius = 1;

	var dx = a1.x-a2.x;
	var dy = a1.y-a2.y;
	return dx*dx + dy*dy < radius * radius;
};

var keys = {};

var keydown = function(ke) {
	// Update the 'keys' object.
	if(ke.keyCode >= 32 && ke.keyCode <= 127)
		keys[ke.keyCode] = true;

	// Other game-related code ...

	// Upon pressing spacebar ...
	if(ke.keyCode === 32) {
		if(dialogue) {
			dialogue = false;
		} else {
			// If player is near NPCs, then open a dialogue box
			if(is_near(player, boss))
				talk_to_boss();
			for(var i=0; i<npcs.length; ++i)
				if(is_near(player, npcs[i]))
					talk_to_npc(npcs[i]);

			// If player is near a memo, then take the memo
			for(var i=0; i<shelf.length; ++i)
				if(is_near(player, shelf[i])) {
					var memo = shelf[i];
					shelf.splice(i, 1);
					inventory.push(memo);
					dialogue = 'You got a memo.';
					break;
				}
		}
	}
};

var talk_to_boss = function() {
	dialogue = 'Talking to boss';

	if(shelf.length === 0  &&  inventory.length === 0) {
		if(curr_progression === progression.length) {
			// No memos remain
			dialogue = 'There are no more memos.';
		} else {
			// Boss assigns new memos
			dialogue = 'More memos must be delivered.';
			var memo_set = progression[curr_progression++];
			for(var i=0; i<memo_set.length; ++i) {
				var memo = memo_set[i];
				memo.x = 10;
				memo.y = 10+i;
				shelf.push(memo);
			}
		}
	} else {
		dialogue = 'You have work to do.';
	}
};

var talk_to_npc = function(npc) {
	dialogue = 'Talking to npc #' + npc.id;
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
	var tileset = TileMaps.desert.tilesets[1];
	var cols = tileset.columns;
	var s = tileset.spacing;
	var m = tileset.margin;
	var iw = tileset.tilewidth;
	var ih = tileset.tileheight;
	var firstgid = tileset.firstgid;

	return function(ctx, id, x, y, w, h) {
//		id = id-firstgid;
		Game.drawImage(ctx, 'tile_sheet.png',
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

	Game.collide(grid, player);
};

var draw = function(ctx) {
	ctx.save();
	ctx.translate(-player.x*GRID_SIZE+WIDTH/2, -player.y*GRID_SIZE+HEIGHT/2);

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

	// Draw the memos on the shelf
	for(var i=0; i<shelf.length; ++i)
		Game.drawImage(ctx, 'hello.png',
		               shelf[i].x*GRID_SIZE, shelf[i].y*GRID_SIZE);

	// Text Dialogue Boxes
	if(dialogue) {
		dialogueBox(ctx, dialogue, false);
	}

	ctx.restore();
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
