function GameState(scene) {
	this.scene = scene;
	
	// Primitives
	this.board = new Board(scene);
	this.auxiliar_board1 = new AuxiliarBoard(scene, 1);
	this.auxiliar_board2 = new AuxiliarBoard(scene, 2);
	
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

		
	// Game State variables
	this.current_player = 1;
	this.selected_piece = null;
	this.jumping = false;
	this.animated = false;
	this.jump_moves = [];
	this.adjoin_moves = [];
	this.center_moves = [];
	
	// Previous moves
	this.previous_moves = [];
	
	// Game time
	this.game_time = 0;
	
	// Turn time
	this.turn_time = localStorage.turn_time;
}

GameState.prototype.display = function() {
	this.scene.pushMatrix();
		this.scene.translate(-7.28,0,0);
		this.scene.rotate(Math.PI, 0, 1, 0);
		this.scene.rotate(-Math.PI/2, 1, 0, 0);
		this.scene.scale(10,10,10);
		this.auxiliar_board1.display();
	this.scene.popMatrix();
	
	this.scene.pushMatrix();
		this.scene.translate(7.28,0,0);
		this.scene.rotate(-Math.PI/2, 1, 0, 0);
		this.scene.scale(10,10,10);
		this.auxiliar_board2.display();
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

// Piece id [1, 100], Tile id [101, 200]
GameState.prototype.processPick = function(picked_obj) {
	var board = this.piece_positions;
	var coord = [picked_obj.x, picked_obj.y];
		
	// Map picked tile to piece on top if exists
	if (picked_obj instanceof Tile) {
		var piece = this.checkIfExistsPiece(picked_obj.x, picked_obj.y);
		if (piece != null) {
			picked_obj = piece;
		}
	}
	
	// If picked object belongs to player change selected piece to that
	// Disabled during animations and multiple jump moves
	if (picked_obj.player == this.current_player && !this.jumping && !this.animated) {
		this.board.deSelectAllTiles();
		this.selected_piece = picked_obj;
		var request_string = this.createRequestString('100', board, coord, this.current_player);
		var jump_moves = makeRequest(request_string);
		this.jump_moves = processString(jump_moves.response);
		
		request_string = this.createRequestString('200', board, coord, this.current_player);
		var adjoin_moves = makeRequest(request_string);
		this.adjoin_moves = processString(adjoin_moves.response);

		request_string = this.createRequestString('300', board, coord, this.current_player);
		var center_moves = makeRequest(request_string);
		this.center_moves = processString(center_moves.response);
		
		this.board.setSelectedTiles(this.jump_moves.concat(this.adjoin_moves, this.center_moves));
	}
	// If picked object is not the players check it corresponds to an available move
	// Disables during animations
	else if (this.selected_piece != null && !this.animated) {
		var id;
		if (picked_obj instanceof Tile) {
			id = picked_obj.id - 101;
		}
		else if (picked_obj instanceof Piece) {
			id = picked_obj.id - 1;
		}
		
		if (this.adjoin_moves.indexOf(id) >= 0) {
			this.board.deSelectAllTiles();
			var game_move = new GameMove(this, picked_obj, false);
			this.previous_moves.push(game_move);
			this.nextPlayer();
		}
		else if (this.center_moves.indexOf(id) >= 0) {
			this.board.deSelectAllTiles();
			var game_move = new GameMove(this, picked_obj, false);
			this.previous_moves.push(game_move);
			this.nextPlayer();
		}
		else if (this.jump_moves.indexOf(id) >= 0) {
			this.board.deSelectAllTiles();
			var game_move = new GameMove(this, picked_obj, true);
			this.previous_moves.push(game_move);
			this.jumping = true;
		}
	}
}

GameState.prototype.checkMultiJump = function() {
	var board = this.piece_positions;
	var coord = [this.selected_piece.x, this.selected_piece.y];
	
	// Check if selected piece is still on the board
	// Finish jump move if its not
	if (this.selected_piece.x < 10 && this.selected_piece.x >= 0 && this.selected_piece.y < 10 && this.selected_piece.y >= 0) {
		var request_string = this.createRequestString('100', board, coord, this.current_player);
		var jump_moves = makeRequest(request_string);
		var process_jump_moves = processString(jump_moves.response);
		
		// If there's no available jumps finish the jump
		// Else update moves to only allow jumps and continue
		if (process_jump_moves.length == 0) {
			this.jumping = false;
			this.updateNumberOfPieces();
			this.nextPlayer();
		}
		else {
			this.jump_moves = process_jump_moves;
			this.center_moves = [];
			this.adjoin_moves = [];
			this.jumping = true;
			this.updateNumberOfPieces();
			this.board.setSelectedTiles(this.jump_moves);
		}
	}
	else {
		this.jumping = false;
		this.updateNumberOfPieces();
		this.nextPlayer();
	}
}



GameState.prototype.createRequestString = function(request_number, board, coord, current_player) {
	// request string: request_number-board-coord
	// board lines separated by 9

	var request_string = request_number + "-";
	
	for (var i = 0; i < board.length; i++) {
		for (var j = 0; j < board[i].length; j++) {
			request_string += board[i][j];
		}
	}

	request_string += "-";
	request_string += coord[0];
	request_string += coord[1];

	request_string += "-";
	request_string += current_player;

	return request_string;
}

// Checks if a piece exists with the xy coordinates given
GameState.prototype.checkIfExistsPiece = function(x, y) {
	for (var i = 0; i < this.pieces.length; i++) {
		if (this.pieces[i].x == x && this.pieces[i].y == y) {
			return this.pieces[i];
		}
	}
	
	return null;
}

// Change active player
GameState.prototype.nextPlayer = function() {
	this.current_player = 1 + (this.current_player % 2);
	this.jump_moves = [];
	this.center_moves = [];
	this.adjoin_moves = [];
	
	this.turn_time = localStorage.turn_time;
}

// Return number of pieces in piece_positions with piece value 
GameState.prototype.getNumberOfPieces = function(piece) {
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
GameState.prototype.updateNumberOfPieces = function() {
	document.getElementById('player-white-score').innerHTML = this.getNumberOfPieces(2);
	document.getElementById('player-black-score').innerHTML = this.getNumberOfPieces(1);
}

GameState.prototype.update = function() {
	// Update interface
	// - Game time
	this.game_time += this.scene.updatePeriod/500;
	var minutes = Math.floor(this.game_time/60);
	var seconds = Math.floor(this.game_time%60);
	var formatted_time = "";
	if (minutes < 10) {
		formatted_time += "0";
	}
	formatted_time += minutes + ":";
	if (seconds < 10) {
		formatted_time += "0";
	}
	formatted_time += seconds;
	document.getElementById('game-timer').innerHTML = formatted_time;
	
	// - Turn time
	this.turn_time -= this.scene.updatePeriod/500;
	var turn_seconds = Math.floor(this.turn_time);
	document.getElementById('turn-time-countdown').innerHTML = turn_seconds;
	
	// Do animations
	this.animated = false;
	for (var i = 0; i < this.previous_moves.length; i++) {
		if (this.previous_moves[i].animated) {
			this.animated = true;
			this.previous_moves[i].update();
			
			// Wait for current animations to finish
			if (!this.previous_moves[i].animated && this.jumping) {
				// Check if more jumps for the selected piece are available (multiple jump move)
				this.checkMultiJump();
			}
		}
	}
}