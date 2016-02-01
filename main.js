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

var assert = function(b) {
	if(!b) {
		debugger;
		throw 'assertion failed';
	}
};


var WIDTH = 640;
var HEIGHT = 480;
var GRID_SIZE = Game.GRID_SIZE;

var curr_progression = 0;

// The 'dialogue' global variable ...
// It can be null, which means the game is currently playable.
// It can also be a structure with the following form:
//   {
//     type: This must be equal to 'nonchoice'.
//     text: A string to be displayed currently.
//     cb:   A function to be called when the player presses spacebar.
//   }
// There are some helper functions:
//   nonchoice(): creates a structure with the above form and sets the global
//                to it
//   

// Game state
var player = {x: 19.75, y: 4};
var grid = [];
var dialogue = null;
var shelf = [];
var inventory = [];
var twoweeks = {
	type: 'nonexistent'
};

var boss;
var npcs = [];

npc_names = {
	'4': 'THE BOSS',
	'5': 'DAISY',
	'6': 'ROBERT',
	'7': 'GALE',
	'8': 'JASPER',
	'9': 'FRANCINE',
	'10': 'COLIN',
	'11': 'SUSAN',
	'12': 'TINA',
	'13': 'VALERIE',
	'14': 'PHIL',
	'15': 'WALLACE',
	'16': 'EDNA',
	'17': 'MONICA',
	'18': 'THE ENTREPRENEUR',
};

var find = function(a, name) {
	for(var i=0; i<a.length; ++i)
		if(a[i].name === name)
			return a[i];
	assert(false);
};

var dismiss_dialogue = function() {
	if(dialogue.type === 'nonchoice')
		dialogue.cb();
	else if(dialogue.type === 'twochoice') {
		if(dialogue.respondYes === true)
			dialogue.cb1();
		else
			dialogue.cb2();
	}
		
};
var nonchoice = function(text, cb) {
	if(cb === undefined)
		cb = function() {dialogue = null;};

	dialogue = {
		type: 'nonchoice',
		text: text,
		cb: cb
	};
};

var twochoice = function(text, textYes, textNo, cb1, cb2) {
	if(cb1 === undefined)
		cb1 = function() {dialogue = null;};
	if(cb2 === undefined)
		cb2 = function() {dialogue = null;};
	dialogue = {
		type: 'twochoice',
		text: text,
		textYes: 'Yes',
		textNo: 'No',
		cb1: cb1,
		cb2: cb2,
		respondYes: false	
	};
}

window.onload = function() {
	var c = document.getElementById("myCanvas");

	c.setAttribute('width', WIDTH);
	c.setAttribute('height', HEIGHT);
	
	var ctx = c.getContext("2d");

	ctx.mozImageSmoothingEnabled = false;
	ctx.webkitImageSmoothingEnabled = false;
	ctx.msImageSmoothingEnabled = false;
	ctx.imageSmoothingEnabled = false;

	// Create the grid from the tilemap
	var ground_layer = find(TileMaps.desert.layers, 'Ground')
	var tileset = TileMaps.desert.tilesets[1];
	var h = ground_layer.height;
	var w = ground_layer.width;
	for(var i=0; i<h; ++i) {
		grid.push([]);

		for(var j=0; j<w; ++j) {
			(function() {
				var is_wall = false;
				for(var k=0; k<TileMaps.desert.layers.length; ++k) {
					var layer = TileMaps.desert.layers[k];
					var map_data = layer.data;
					var id = map_data[j + w*i] - tileset.firstgid;
					if(tileset.tileproperties[id] === undefined)
						tileset.tileproperties[id] = {};
					if(tileset.tileproperties[id].Solid !== undefined)
						is_wall = true;
				}

				var tile = {
					is_solid: function() {return is_wall;},
				};
				grid[i].push(tile);
			}())
		}
	}

	// Find NPC positions in the tilemap
	var layer_npc = find(TileMaps.desert.layers, 'Annotation');
	var firstgid = TileMaps.desert.tilesets[0].firstgid;
	var npc_data = layer_npc.data
	for(var i=0; i<h; ++i) {
		for(var j=0; j<w; ++j) {
			var id = npc_data[j + w*i] - firstgid;
			var x = j+.5;
			var y = i+.5;

			if(id < 4) //nobody
				continue;
			else if(id === 4) //boss
				boss = {id: id, x: x, y: y, curr_idle_text: 0};
			else if(id < firstgid+24) //npc
				npcs.push({id: id, x: x, y: y, curr_idle_text: 0});
		}
	}

	// Set the initial dialogue box
	nonchoice('THE BOSS: "Ah! Just the person I wanted to see! How are you doing?"', function() {
		nonchoice('THE BOSS: "GOOD. I need you to deliver these memos to their recipients. Think you can do that?"', function() {
			assign_memos();
			nonchoice('THE BOSS: "GOOD. Report back to me when you are done. Off you go!"');
		});
	});

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

var sqdist = function(a1, a2) {
	var dx = a1.x-a2.x;
	var dy = a1.y-a2.y;
	return dx*dx + dy*dy;
};
var is_near = function(a1, a2, radius) {
	if(radius === undefined)
		radius = 1;

	return sqdist(a1, a2) < radius * radius;
};

var keys = {};

		
var keydown = function(ke) {
	// Update the 'keys' object.
	if(ke.keyCode >= 32 && ke.keyCode <= 127)
		keys[ke.keyCode] = true;

	// Other game-related code ...
/*
	if(ke.keyCode === 66) // letter b
	{
		twochoice("test dialogue");
	}
*/
		
	// Dialogue choice
	if(dialogue !== null && dialogue.type === 'twochoice') {
		if(ke.keyCode === 64+23) // up
			dialogue.respondYes = true;
		if(ke.keyCode === 64+19) // down
			dialogue.respondYes = false;
	}

	// Upon pressing spacebar ...
	if(ke.keyCode === 32) {
		if(dialogue !== null) {
			dismiss_dialogue();
		} else {
			// If player is near NPCs, then open a dialogue box
			if(is_near(player, boss, 2)) {
				talk_to_boss();
				return;
			}
			for(var i=0; i<npcs.length; ++i)
				if(is_near(player, npcs[i], 2)) {
					talk_to_npc(npcs[i]);
					return;
				}

			// Find nearest memo
			var nearest = null;
			var nearest_i = null;
			var lowest = 2;
			for(var i=0; i<shelf.length; ++i)
				if(sqdist(shelf[i], player) < lowest) {
					nearest = shelf[i];
					nearest_i = i;
					lowest = sqdist(shelf[i], player);
				}
			if(twoweeks.type === 'onshelf' && sqdist(twoweeks, player) < lowest) {
				nearest = twoweeks;
				lowest = sqdist(twoweeks, player);
			}

			if(nearest !== null) {
				if(nearest.type === 'memo') {
					// If player is near a memo, then take the memo
					(function() {
						var memo = nearest;
						var i = nearest_i;
						var name = npc_names[memo.npc];
						twochoice('It is a memo for '+name+'. Do you want to take it?', 'Yes', 'No', function(){  //##
							takeMemo(memo, i);
						});
					}());
					return;
				} else if(nearest.type === 'onshelf') {
					// Take the two-weeks notice
					twochoice('Take the two-weeks notice form?', 'Yes', 'No', function() {
						twoweeks = {
							type: 'taken'
						};
						dialogue = null;
					});
				} else {
					assert(false);
				}
			}

		}
	}
};

var takeMemo = function(memo, index_in_shelf) {
	shelf.splice(index_in_shelf, 1);
	inventory.push(memo);	
	nonchoice('You got a memo for ' + npc_names[memo.npc] + '.');
}

var assign_memos = function() {
	var memo_set = progression[curr_progression++];
	for(var i=0; i<memo_set.length; ++i) {
		var memo = memo_set[i];
		memo.x = 22.25;
		memo.y = 1.25+i;
		memo.type = 'memo';
		shelf.push(memo);
	}
};

var talk_to_boss = function() {
	if(twoweeks.type === 'taken') {
		twochoice('Give the "Two weeks notice" form?', 'Yes', 'No', function() {
			twoweeks = {
				type: 'given'
			};
			dialogue = null;
		}, function() {
			talk_to_boss_normal();
		});
	} else {
		talk_to_boss_normal();
	}
};

var talk_to_boss_normal = function() {
	if(shelf.length === 0  &&  inventory.length === 0) {
		if(curr_progression === progression.length) {
			// No memos remain
//			nonchoice('There are no more memos.');  //##
			display_idle_text(boss);
		} else {
			// Boss assigns new memos
			nonchoice('More memos must be delivered.'); //##
			assign_memos();
		}
	} else {
		// The player still needs to deliver some memos.
//		nonchoice('You have work to do.');  //##
		display_idle_text(boss);
	}
};

var talk_to_npc = function(npc) {
//	nonchoice('Talking to npc #' + npc.id);

	// Does the player have a memo for this npc?
	for(var i=0; i<inventory.length; ++i) {
		var memo = inventory[i];
		if(memo.npc === npc.id) {
			inventory.splice(i, 1);
			display_memo(memo.msg, npc_names[npc.id]);

			if(inventory.length === 0 &&
					curr_progression === 5 &&
					twoweeks.type === 'nonexistent')
				twoweeks = {
					type: 'onshelf',
					x: 22.25,
					y: 4.25
				};

			return;
		}
	}

	display_idle_text(npc);
};

var display_memo = function(msg, name) {
	if(typeof(msg) === 'string') {
		nonchoice('You peek at the memo: "' + msg + '"');  //##
	} else {
		if(msg.length === 0)
			dialogue = null;
		else
			nonchoice(name + ': "' + msg[0] + '"', function() {
				display_memo(msg.slice(1), name);
			});
	}
};

var display_idle_text = function(npc) {
	var my_idle_text = idle_text[npc.id];

	var text = my_idle_text[npc.curr_idle_text];
	npc.curr_idle_text = (npc.curr_idle_text+1) % my_idle_text.length;

	text = npc_names[npc.id] + ': "' + text + '"'; //##
	nonchoice(text);
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
		if(id < 0)
			return;

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
	if(dialogue === null) {
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

var draw_layer = function(ctx, layer) {
	var tileset = TileMaps.desert.tilesets[1];
	var h = layer.height;
	var w = layer.width;
	var map_data = layer.data;
	for(var i=0; i<h; ++i) {
		for(var j=0; j<w; ++j) {
			var id = map_data[j + w*i] - tileset.firstgid;
			var x = j*GRID_SIZE;
			var y = i*GRID_SIZE;
			draw_tile(ctx, id, x, y, GRID_SIZE, GRID_SIZE);
		}
	}
};

var FONT = "bold 14px sans-serif";
var LINEHEIGHT = 14;
var draw = function(ctx) {
	if(twoweeks.type === 'given')
		return;

	var SCALE = 2;
	ctx.save();
	ctx.scale(SCALE, SCALE);
	ctx.translate(-player.x*GRID_SIZE, -player.y*GRID_SIZE);
	ctx.translate(WIDTH/2/SCALE, HEIGHT/2/SCALE);

	// Draw the backgrounds
	for(var k=0; k<TileMaps.desert.layers.length; ++k) {
		var layer = TileMaps.desert.layers[k];
		if(layer.name === 'Annotation')
			continue;

		draw_layer(ctx, layer);
	}

	// Draw the memos on the shelf
	for(var i=0; i<shelf.length; ++i)
		Game.drawImage(ctx, 'envelope.png',
		               (shelf[i].x-.25)*GRID_SIZE, (shelf[i].y-.25)*GRID_SIZE);
	if(twoweeks.type === 'onshelf')
		Game.drawImage(ctx, 'memo.png',
		               (twoweeks.x-.25)*GRID_SIZE, (twoweeks.y-.25)*GRID_SIZE);

	// Draw the boss
	Game.drawImage(ctx, 'NPC.png',
	               (boss.x-1.25) * GRID_SIZE, (boss.y-2) * GRID_SIZE);

	// Draw the NPCs
	for(var i=0; i<npcs.length; ++i)
		if(npcs[i].id !== 15)
			Game.drawImage(ctx, 'NPC.png',
		               (npcs[i].x-.75) * GRID_SIZE, (npcs[i].y-.25) * GRID_SIZE);

	// Draw the player
	ctx.fillStyle = 'red';
	var PSIZE = Game.PLAYER_SIZE;
	ctx.fillRect(player.x * GRID_SIZE, player.y * GRID_SIZE, PSIZE, PSIZE);

	ctx.restore();

	// Text Dialogue Boxes
	if(dialogue) {
		dialogueBox(ctx, dialogue, false);
	}

	// Display inventory
	var h = inventory.length * LINEHEIGHT + 3;
	if(twoweeks.type === 'taken') {
		h += LINEHEIGHT;
	}
	ctx.font = FONT;
	ctx.fillStyle = 'rgba(32, 32, 32, 0.5)';
	ctx.fillRect(0, 0, 150, h);
	ctx.fillStyle = 'white';
	for(var i=0; i<inventory.length; ++i) {
		var text = 'Memo for ' + npc_names[inventory[i].npc];
		ctx.fillText(text, 3, (1+i) * LINEHEIGHT);
	}
	if(twoweeks.type === 'taken') {
		ctx.fillText('Two-weeks notice', 3, h-3);
	}
};

var dialogueBox = function(ctx, dlg, textOptions) {
	// values
	var WRAPWIDTH = 200;
	var BX = WIDTH/4;
	var BY = HEIGHT/2+50;
	var BOXWIDTH = WIDTH/2;
	var BOXHEIGHT = HEIGHT/2-100;
	var PADDING = 20;
	var bTextOptions = textOptions;

	ctx.font = FONT;
	ctx.fillStyle = '#202020';
	ctx.fillRect(BX, BY, BOXWIDTH, BOXHEIGHT);
	ctx.fillStyle = 'white';
	if(dlg.type === 'nonchoice')
		wrapText(ctx, dlg.text, BX + PADDING, BY + PADDING, WRAPWIDTH, LINEHEIGHT)
	else if(dlg.type === 'twochoice') {		
		wrapText(ctx, dlg.text, BX + PADDING, BY + PADDING, WRAPWIDTH, LINEHEIGHT)	
		ctx.fillStyle = '#333333';
		ctx.fillRect(BX, BY + BOXHEIGHT, BOXWIDTH, BOXHEIGHT);
		ctx.fillStyle = 'white';
		ctx.fillText(dlg.textYes, BX + PADDING + 10, BY + BOXHEIGHT + PADDING);
		ctx.fillText(dlg.textNo, BX + PADDING + 10, BY + BOXHEIGHT + 20 + PADDING);
		if(dlg.respondYes) {
			ctx.fillStyle = 'red';
			ctx.fillRect(BX + 10, BY + BOXHEIGHT + 10, 10, 10);
		}
		else {
			ctx.fillStyle = 'red';
			ctx.fillRect(BX + 10, BY + BOXHEIGHT + 30, 10, 10);
		}
	}		
	else
		assert(false);
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
