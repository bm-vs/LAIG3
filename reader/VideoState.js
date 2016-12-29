function VideoState(scene) {
	this.scene = scene;
	this.loadedOk = null;
	
	// Primitives
	this.board = new Board(scene);
	this.auxiliary_board1 = new AuxiliaryBoard(scene, 1);
	this.auxiliary_board2 = new AuxiliaryBoard(scene, 2);
	
	var id = 0;
	this.pieces = [];
	for (var line = 0; line < 10; line++) {
		for (column = 0; column < 10; column++) {
			this.pieces[id] = new Piece(scene, id+1, column, line);
			id++;
		}
	}

	// Board State
	this.piece_positions =
		[[2,1,2,1,2,1,2,1,2,1],
		[1,2,1,2,1,2,1,2,1,2],
		[2,1,2,1,2,1,2,1,2,1],
		[1,2,1,2,1,2,1,2,1,2],
		[2,1,2,1,2,1,2,1,2,1],
		[1,2,1,2,1,2,1,2,1,2],
		[2,1,2,1,2,1,2,1,2,1],
		[1,2,1,2,1,2,1,2,1,2],
		[2,1,2,1,2,1,2,1,2,1],
		[1,2,1,2,1,2,1,2,1,2]];
	
	// Video State variables
	this.animated = false;
	this.ended = false;
	this.moves = [];
	this.current_move = -1;
	this.current_player = 1;
}

VideoState.prototype.display = function() {
	this.scene.pushMatrix();
		this.scene.translate(-7.28,0,0);
		this.scene.rotate(Math.PI, 0, 1, 0);
		this.scene.rotate(-Math.PI/2, 1, 0, 0);
		this.scene.scale(10,10,10);
		this.auxiliary_board1.display();
	this.scene.popMatrix();
	
	this.scene.pushMatrix();
		this.scene.translate(7.28,0,0);
		this.scene.rotate(-Math.PI/2, 1, 0, 0);
		this.scene.scale(10,10,10);
		this.auxiliary_board2.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
		this.scene.rotate(-Math.PI/2, 1, 0, 0);
		this.scene.scale(10,10,10);
		this.board.display();
	this.scene.popMatrix();

	for (var pieces = 0; pieces < this.pieces.length; pieces++) {
		this.scene.pushMatrix();
			this.scene.translate(-4.5, 0, 4.5);
			this.scene.rotate(-Math.PI/2, 1, 0, 0);
			this.pieces[pieces].display();
		this.scene.popMatrix();
	}
}

VideoState.prototype.update = function() {
	// Do animations
	this.animated = false;
	
	// Move to the next animation if the current one is not animated
	if (this.current_move >= 0) {
		if (this.moves[this.current_move].animated) {
			this.animated = true;
			this.moves[this.current_move].update();
			
			// Wait for current animations to finish
			if (!this.moves[this.current_move].animated) {
				this.updateNumberOfPieces();
				this.nextMove();
			}
		}
	}
	else {
		this.nextMove();
	}
}

VideoState.prototype.nextMove = function() {
	if (this.current_move < this.moves.length - 1) {
		this.current_move++;
		this.moves[this.current_move].animated = true;
		this.current_player = this.piece_positions[this.moves[this.current_move].from_y][this.moves[this.current_move].from_x];
		this.moves[this.current_move].startAnimation();
		
		if (this.current_player == 1) {
			document.getElementById('player-black').style.backgroundColor = '#6373FF';
			document.getElementById('player-white').style.backgroundColor = '#CCE5FF';
		}
		else if (this.current_player == 2) {
			document.getElementById('player-white').style.backgroundColor = '#6373FF';
			document.getElementById('player-black').style.backgroundColor = '#CCE5FF';
		}
		
	}
}

// Return number of pieces in piece_positions with piece value 
VideoState.prototype.getNumberOfPieces = function(piece) {
	var count = 0;
	
	for (var i = 0; i < this.piece_positions.length; i++) {
		for (var j = 0; j < this.piece_positions[i].length; j++) {
			if (this.piece_positions[i][j] == piece) {
				count++;
			}
		}
	}
	
	return count;
}

// Update number of pieces
VideoState.prototype.updateNumberOfPieces = function() {
	var nr_pieces1 = this.getNumberOfPieces(1);
	var nr_pieces2 = this.getNumberOfPieces(2);

	document.getElementById('player-white-score').innerHTML = nr_pieces2;
	document.getElementById('player-black-score').innerHTML = nr_pieces1;
	
	// End the game and choose the winner if either number of pieces is 0 or the last move was made
	if (nr_pieces1 == 0 || nr_pieces2 == 0 || this.current_move == this.moves.length-1) {
		document.getElementById('modal').style.display = "block";
	
		if (nr_pieces1 == 0 && nr_pieces2 == 0) {
			this.winner = this.current_player;
			this.ended = true;
		}
		else if (nr_pieces1 == 0) {
			this.winner = 2;
			this.ended = true;
		}
		else if (nr_pieces2 == 0) {
			this.winner = 1;
			this.ended = true;
		}
		else {
			this.winner = this.current_player;
			this.ended = true;
		}
		
		document.getElementById('winner').innerHTML = "Player " + this.winner + " wins!";
	}
}

