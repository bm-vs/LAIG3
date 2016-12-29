function VideoMove(scene, from_x, from_y, to_x, to_y, jumped_to_x, jumped_to_y) {
	this.scene = scene;
	this.game_state = this.scene.videoState;
	this.from_x = from_x;
	this.from_y = from_y;
	this.to_x = to_x;
	this.to_y = to_y;
	this.jumped_to_x = jumped_to_x;
	this.jumped_to_y = jumped_to_y;
	this.animated = false;
	this.animation = null;
	this.animation_jumped = null;
}

// Start animation for move
VideoMove.prototype.startAnimation = function() {
	if (typeof this.jumped_to_x === 'undefined' || typeof this.jumped_to_y === 'undefined') {
		this.processRegularMove();
	}
	else {
		this.processJumpMove();
	}
}

VideoMove.prototype.processRegularMove = function() {
	var piece = this.getPieceFromCoord(this.from_x, this.from_y);

	// Change game state piece positions
	var n = this.game_state.piece_positions[this.from_y][this.from_x];
	this.game_state.piece_positions[this.from_y][this.from_x] = 0;
	if (this.to_x < 10 && this.to_x >= 0 && this.to_y < 10 && this.to_y >= 0) {
		this.game_state.piece_positions[this.to_y][this.to_x] = n;
		piece.id = this.to_y*10+this.to_x + 1;
	}

	// Create animation
	this.animated = true;
	this.animation = new AnimationPiece(this.game_state.scene, this, piece, this.from_x, this.from_y, this.to_x, this.to_y);
	this.animation_jumped = null;
}

VideoMove.prototype.processJumpMove = function() {
	var piece = this.getPieceFromCoord(this.from_x, this.from_y);

	// Change game state piece positions
	var n = this.game_state.piece_positions[this.from_y][this.from_x];
	this.game_state.piece_positions[this.from_y][this.from_x] = 0;
	if (this.jumped_to_x < 10 && this.jumped_to_x >= 0 && this.jumped_to_y < 10 && this.jumped_to_y >= 0) {
		this.game_state.piece_positions[this.jumped_to_y][this.jumped_to_x] = n;
		piece.id = this.jumped_to_y*10+this.jumped_to_x + 1;
	}
	
	// Create animation
	this.animated = true;
	this.animation = new AnimationPiece(this.game_state.scene, this, piece, this.from_x, this.from_y, this.jumped_to_x, this.jumped_to_y);
	
	// Remove jumped piece
	this.game_state.piece_positions[this.to_y][this.to_x] = 0;
	var removed = this.getPieceFromCoord(this.to_x, this.to_y);
	this.animation_jumped = new AnimationRemove(this.game_state.scene, this, removed, this.to_x, this.to_y);
}

// When animation ends
VideoMove.prototype.finishMove = function(piece, to_x, to_y) {
	this.animated = false;
	this.animation = null;
	piece.x = to_x;
	piece.y = to_y;
	piece.z = 0;
	
	// Check if piece stays on the board and remove if it doesn't
	if (to_x < 10 && to_x >= 0 && to_y < 10 && to_y >= 0) {
		
		// If the move was a jump remove the jumped piece
		if (this.animation_jumped != null) {
			this.animated = true;
			this.animation = this.animation_jumped;
			this.animation_jumped = null;
		}
	}
	else {
		this.animated = true;
		this.animation = new AnimationRemove(this.game_state.scene, this, piece, to_x, to_y); 
	}
}

// When piece removal ends
VideoMove.prototype.finishRemoval = function(piece, to_x, to_y) {
	this.animated = false;
	this.animation = null;
	piece.x = to_x;
	piece.y = to_y;
	if (localStorage.theme == 2) {
		piece.z = -0.1;
	}
	
	// Remove jumped piece
	if (this.animation_jumped != null) {
		this.animated = true;
		this.animation = this.animation_jumped;
		this.animation_jumped = null;
	}
}

VideoMove.prototype.update = function() {
	if (this.animation != null) {
		this.animation.update();
	}
}

VideoMove.prototype.getPieceFromCoord = function(x, y) {
	for (var i = 0; i < this.game_state.pieces.length; i++) {
		if (this.game_state.pieces[i].x == x && this.game_state.pieces[i].y == y) {
			return this.game_state.pieces[i];
		}
	}
}






