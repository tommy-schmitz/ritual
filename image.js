// Load main library
var Game = window.Game || {};

Game.drawImage = (function() {
	// Image cache
	var images = {};
	// List of all images in the game
	var	imageList = [
			'hello.png'
			, 'tile_sheet.png'
			, 'NPC.png'
			, 'envelope.png'
			, 'memo.png'
		];
	
	// Pre-load all images
	Game.loadImages = function(callback) {
		var numLoadedImages = 0, i, img;
		
		for(i = 0;  i < imageList.length;  ++i) {
			img = new Image();
			images[imageList[i]] = img;
			// Call the callback after all images are loaded
			img.onload = function() {
				++numLoadedImages;
				if(numLoadedImages == imageList.length)
					callback();
			};
			img.src = imageList[i];
		}
	}

	// Draw an image
	return function (ctx, filename) {
		var imageArgs = Array.prototype.slice.call(arguments,2);
		imageArgs.unshift(images[filename]);
		ctx.drawImage.apply(ctx,imageArgs);
		//ctx.drawImage(images[filename], x, y);
	};
}());

Game.drawImageInWorld = Game.drawImage;
/*
function(ctx, filename, x, y) {
	return Game.drawImage(ctx, filename, x-Game.camera.x, y-Game.camera.y);
};
*/
