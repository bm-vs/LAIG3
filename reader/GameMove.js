function GameMove(game_state, destination, jump) {
	this.game_state = game_state;
	this.destination = destination;

	this.from_x = this.game_state.selected_piece.x;
	this.from_y = this.game_state.selected_piece.y;
	this.to_x = destination.x;
	this.to_y = destination.y;
	this.from_piece = this.game_state.piece_positions[this.from_y][this.from_x];
	this.to_piece = this.game_state.piece_positions[this.to_y][this.to_x];
	this.animated = false;
	this.animation = null;
	
	if (jump) {
		this.processJumpMove();
	}
	else {
		this.processMove();
	}
}

GameMove.prototype.processMove = function() {
	this.animated = true;
	this.animation = new AnimationPiece(this.game_state.scene, this, this.game_state.selected_piece, this.from_x, this.from_y, this.to_x, this.to_y);
}


GameMove.prototype.processJumpMove = function(destination) {
	// Change board state
	var n = this.game_state.piece_positions[this.from_y][this.from_x];
	this.game_state.piece_positions[this.from_y][this.from_x] = 0;
	this.game_state.piece_positions[this.to_y][this.to_x] = 0;
	
	// Move selected piece to space after jumped piece
	this.jumped_to_x = this.game_state.selected_piece.x + 2*(this.to_x - this.from_x);
	this.jumped_to_y = this.game_state.selected_piece.y + 2*(this.to_y - this.from_y);
	
	this.game_state.selected_piece.x = this.jumped_to_x;
	this.game_state.selected_piece.y = this.jumped_to_y;
	
	if (this.jumped_to_x < 10 && this.jumped_to_x >= 0 && this.jumped_to_y < 10 && this.jumped_to_y >= 0) {
		this.game_state.piece_positions[this.jumped_to_y][this.jumped_to_x] = n;
		this.game_state.selected_piece.id = this.jumped_to_y*10+this.jumped_to_x + 1;
	}
	else {
		// Remove jump piece if it goes out of the board
		this.game_state.selected_piece.id = -1;
		this.game_state.selected_piece.x = 11;
		this.game_state.selected_piece.y = 4;
	}
	
	// Remove jumped piece
	this.destination.id = -1;
	this.destination.x = 11;
	this.destination.y = 5;
}

GameMove.prototype.update = function() {
		if (this.animation != null) {
			this.animation.update();
		}
}


