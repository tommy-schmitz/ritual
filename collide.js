(function() {


// This is an "import" statement ...
var Game = window.Game = window.Game || {};

var GRID_SIZE = Game.GRID_SIZE = 32;
Game.PLAYER_SIZE = 16;

var PLAYER_WIDTH = Game.PLAYER_SIZE / GRID_SIZE;
var PLAYER_HEIGHT = Game.PLAYER_SIZE / GRID_SIZE;


Game.collide = function(grid, actor) {
	var result = [false,0];
	var resolveCollisions = function(x, y, dir) {
		var j = Math.floor(x);
		var i = Math.floor(y);
		var xoff = x - (j+((dir.x+1)/2));
		var yoff = y - (i+((dir.y+1)/2));
		var snapx, snapy;

		if(grid[i] === undefined)
			debugger;

/*
        if(grid[i][j].getDeath() && actor.invincibility <= 0) {
            actor.hp = 0;
			actor.dead = 1;
            return;
        }
        if(grid[i][j].worldTarget) {
            Game.ui.state.gs.travelTo(grid[i][j].worldTarget);
            return;
        }
*/

		if(!grid[i][j].is_solid())
			return;

		// Set snapx and/or snapy to true, as appropriate
		var canSnapX = grid[i-dir.y][j].is_solid();
		var canSnapY = grid[i][j-dir.x].is_solid();
		snapx = snapy = false;
		if(dir.y === 0)
			snapx = true;
		else if(canSnapX && canSnapY)
			snapx = snapy = true;
		else if(canSnapX)
			snapx = true;
		else if(canSnapY)
			snapy = true;
		else if(dir.x*xoff <= dir.y*yoff)
			snapx = true;
		else
			snapy = true;

		// Nudge the actor
		if(snapx) {
			actor.x  +=  dir.x * -1  -  xoff;
			result[1] = dir.x;
		}
		if(snapy) {
			actor.y  +=  dir.y * -1  -  yoff;
			if(dir.y * actor.vy  >  0) {  // If velocity is "toward" the wall
				actor.vy = 0;
				if(dir.y === 1)
					result[0] = true;
			}
		}
	};

	var HALF_GIRTH  = 0.5 * PLAYER_WIDTH;
	var HALF_HEIGHT = 0.5 * PLAYER_HEIGHT;
	var x0 = function() {return actor.x;};
	var x1 = function() {return actor.x + 2*HALF_GIRTH;};
	var y0 = function() {return actor.y;};
	var y1 = function() {return actor.y + HALF_HEIGHT;};
	var y2 = function() {return actor.y + 2*HALF_HEIGHT;};

	resolveCollisions(x0(), y1(), {x: -1, y: 0});
	resolveCollisions(x1(), y1(), {x: 1, y: 0});
	resolveCollisions(x0(), y0(), {x: -1, y: -1});
	resolveCollisions(x1(), y0(), {x: 1,  y: -1});
	resolveCollisions(x0(), y2(), {x: -1, y: 1});
	resolveCollisions(x1(), y2(), {x: 1,  y: 1});
//	resolveCollisions(x0(), y0(), {x: -1, y: -1});

	return result;
};


}());
