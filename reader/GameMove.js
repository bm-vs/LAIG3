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
	this.animation_jumped = null;
	
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
	this.animation_jumped = null;
}


GameMove.prototype.processJumpMove = function() {
	this.animated = true;
	this.jumped_to_x = this.game_state.selected_piece.x + 2*(this.to_x - this.from_x);
	this.jumped_to_y = this.game_state.selected_piece.y + 2*(this.to_y - this.from_y);
	this.animation = new AnimationPiece(this.game_state.scene, this, this.game_state.selected_piece, this.from_x, this.from_y, this.jumped_to_x, this.jumped_to_y);
	
	// Remove jumped piece
	this.game_state.piece_positions[this.to_y][this.to_x] = 0;
	this.animation_jumped = new AnimationRemove(this.game_state.scene, this, this.destination, this.to_x, this.to_y);
}

GameMove.prototype.update = function() {
		if (this.animation != null) {
			this.animation.update();
		}
}


