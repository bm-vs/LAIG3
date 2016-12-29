function GameMove(game_state, destination, jump) {
	this.game_state = game_state;
	this.piece = this.game_state.selected_piece;
	this.destination = destination;
	
	this.piece.selected = false;
	this.from_x = this.piece.x;
	this.from_y = this.piece.y;
	this.to_x = destination.x;
	this.to_y = destination.y;
	this.from_piece = this.game_state.piece_positions[this.from_y][this.from_x];
	this.to_piece = this.game_state.piece_positions[this.to_y][this.to_x];
	this.animated = false;
	this.animation = null;
	this.animation_jumped = null;
	
	this.jump = jump;
	if (this.jump) {
		this.processJumpMove();
	}
	else {
		this.processRegularMove();
	}
}

GameMove.prototype.undo = function() {
	// Change game state piece positions	
	if (this.piece.x < 10 && this.piece.x >= 0 && this.piece.y < 10 && this.piece.y >= 0) {
		this.game_state.piece_positions[this.piece.y][this.piece.x] = 0;
	}
	this.game_state.piece_positions[this.from_y][this.from_x] = this.piece.player;
	this.piece.id = this.from_y*10+this.from_x + 1;

	// Create animation
	this.animated = true;
	this.animation = new AnimationPiece(this.game_state.scene, this, this.piece, this.piece.x, this.piece.y, this.from_x, this.from_y);
	this.animation_jumped = null;
	
	if (this.jump) {
		// Change game state piece positions	
		this.game_state.piece_positions[this.to_y][this.to_x] = this.destination.player;
		this.destination.id = this.to_y*10+this.to_x + 1;
	
		this.animation_jumped = new AnimationPiece(this.game_state.scene, this, this.destination, this.destination.x, this.destination.y, this.to_x, this.to_y);
	}
}

// Start animation for moves
GameMove.prototype.processRegularMove = function() {
	// Change game state piece positions
	this.game_state.piece_positions[this.from_y][this.from_x] = 0;
	if (this.to_x < 10 && this.to_x >= 0 && this.to_y < 10 && this.to_y >= 0) {
		this.game_state.piece_positions[this.to_y][this.to_x] = this.from_piece;
		this.piece.id = this.to_y*10+this.to_x + 1;
	}

	// Create animation
	this.animated = true;
	this.animation = new AnimationPiece(this.game_state.scene, this, this.piece, this.from_x, this.from_y, this.to_x, this.to_y);
	this.animation_jumped = null;
}

GameMove.prototype.processJumpMove = function() {
	// Coordinates the piece is going to jump to
	this.jumped_to_x = this.piece.x + 2*(this.to_x - this.from_x);
	this.jumped_to_y = this.piece.y + 2*(this.to_y - this.from_y);
	
	// Change game state piece positions
	this.game_state.piece_positions[this.from_y][this.from_x] = 0;
	if (this.jumped_to_x < 10 && this.jumped_to_x >= 0 && this.jumped_to_y < 10 && this.jumped_to_y >= 0) {
		this.game_state.piece_positions[this.jumped_to_y][this.jumped_to_x] = this.from_piece;
		this.piece.id = this.jumped_to_y*10+this.jumped_to_x + 1;
	}
	
	// Create animation
	this.animated = true;
	this.animation = new AnimationPiece(this.game_state.scene, this, this.piece, this.from_x, this.from_y, this.jumped_to_x, this.jumped_to_y);
	
	// Remove jumped piece
	this.game_state.piece_positions[this.to_y][this.to_x] = 0;
	this.animation_jumped = new AnimationRemove(this.game_state.scene, this, this.destination, this.to_x, this.to_y);
}

// When animation ends
GameMove.prototype.finishMove = function(piece, to_x, to_y) {
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
GameMove.prototype.finishRemoval = function(piece, to_x, to_y) {
	this.animated = false;
	this.animation = null;
	piece.x = to_x;
	piece.y = to_y;
	
	// Remove jumped piece
	if (this.animation_jumped != null) {
		this.animated = true;
		this.animation = this.animation_jumped;
		this.animation_jumped = null;
	}
}

GameMove.prototype.update = function() {
	if (this.animation != null) {
		this.animation.update();
	}
}


