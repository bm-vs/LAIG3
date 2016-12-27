function GameState(scene) {
	this.scene = scene;
	
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

	// Game State variables
	this.ended = false;
	this.winner = null;
	this.current_player = 1;
	this.selected_piece = null;
	this.jumping = false;
	this.animated = false;
	this.jump_moves = [];
	this.adjoin_moves = [];
	this.center_moves = [];
	
	// Previous moves
	this.previous_moves = [];
	this.player_moves = [];
	this.removed_moves = [];
	
	// Game time
	this.start_time = new Date();
	
	// Turn time
	this.turn_start_time = new Date();
}


GameState.prototype.display = function() {
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
		if (this.selected_piece != null) {
			this.selected_piece.selected = false;
		}
		this.selected_piece = picked_obj;
		this.selected_piece.selected = true;
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
			this.player_moves.push(this.current_player);
			this.nextPlayer();
		}
		else if (this.center_moves.indexOf(id) >= 0) {
			this.board.deSelectAllTiles();
			var game_move = new GameMove(this, picked_obj, false);
			this.previous_moves.push(game_move);
			this.player_moves.push(this.current_player);
			this.nextPlayer();
		}
		else if (this.jump_moves.indexOf(id) >= 0) {
			this.board.deSelectAllTiles();
			var game_move = new GameMove(this, picked_obj, true);
			this.previous_moves.push(game_move);
			this.player_moves.push(this.current_player);
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
			this.nextPlayer();
		}
		else {
			this.selected_piece.selected = true;
			this.jump_moves = process_jump_moves;
			this.center_moves = [];
			this.adjoin_moves = [];
			this.jumping = true;
			this.board.setSelectedTiles(this.jump_moves);
		}
	}
	else {
		this.jumping = false;
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


// Reset variables on undo
GameState.prototype.resetState = function() {
	this.board.deSelectAllTiles();
	this.jumping = false;
	this.selected_piece.selected = false;
	this.selected_piece = null;
	
	this.jump_moves = [];
	this.center_moves = [];
	this.adjoin_moves = [];

	// If resetting to the middle of a multiple jump lock to piece doing the jumping
	if (this.previous_moves.length >= 2) {
		var previous_move1 = this.previous_moves[this.previous_moves.length-1];
		var previous_move2 = this.previous_moves[this.previous_moves.length-2];
	
		if (previous_move1.jump && previous_move2.jump && previous_move1.piece.player == previous_move2.piece.player) {
			this.jumping = true;
			this.selected_piece = previous_move1.piece;
			this.selected_piece.selected = true;
			
			var board = this.piece_positions;
			var coord = [previous_move1.from_x, previous_move1.from_y];
			var request_string = this.createRequestString('100', board, coord, previous_move1.piece.player);
			var jump_moves = makeRequest(request_string);
			var process_jump_moves = processString(jump_moves.response);
			this.jump_moves = process_jump_moves;
			this.board.setSelectedTiles(this.jump_moves);
		}
	}
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


// Change active player to next
GameState.prototype.nextPlayer = function() {
	this.current_player = 1 + (this.current_player % 2);
	this.updateToNewPlayer();
	
	this.jump_moves = [];
	this.center_moves = [];
	this.adjoin_moves = [];
}


// Change active player to previous
GameState.prototype.previousPlayer = function() {
	// When the player undoes the first move
	if (this.player_moves.length == 0) {
		this.current_player = 1;
	}
	else {
		this.current_player = this.player_moves[this.player_moves.length - 1];
	}

	this.updateToNewPlayer();
}


// Update game settings to new active player
GameState.prototype.updateToNewPlayer = function() {
	this.turn_start_time = new Date();
	
	if (this.current_player == 1) {
		document.getElementById('player-black').style.backgroundColor = '#388E3C';
		document.getElementById('player-white').style.backgroundColor = '#424242';
	}
	else if (this.current_player == 2) {
		document.getElementById('player-white').style.backgroundColor = '#388E3C';
		document.getElementById('player-black').style.backgroundColor = '#424242';
	}
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
	var nr_pieces1 = this.getNumberOfPieces(1);
	var nr_pieces2 = this.getNumberOfPieces(2);

	document.getElementById('player-white-score').innerHTML = nr_pieces2;
	document.getElementById('player-black-score').innerHTML = nr_pieces1;
	
	// End the game and choose the winner if either number of pieces is 0
	if (nr_pieces1 == 0 || nr_pieces2 == 0) {
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
		
		document.getElementById('winner').innerHTML = "Player " + this.winner + " wins!";
		
		// Save moves to file
		this.saveGameToFile();
	}
}


// End game early
GameState.prototype.endGameEarly = function() {
	// The player that lets his turn countdown reach 0 loses
	document.getElementById('modal').style.display = "block";
	this.ended = true;
	this.winner = (this.current_player%2)+1;
	document.getElementById('winner').innerHTML = "Player " + this.winner + " wins!";
	
	// Save moves to file
	this.saveGameToFile();
}


GameState.prototype.update = function() {
	// Update interface
	// - Game time
	var curr_time = new Date();
	var diff = Math.floor((curr_time-this.start_time)/1000);
	var minutes = Math.floor(diff/60);
	var seconds = Math.floor(diff%60);
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
	var turn_seconds = Math.floor((curr_time-this.turn_start_time)/1000);
	if (turn_seconds >= localStorage.turn_time) {
		turn_seconds = 0;
		this.endGameEarly();
	}
	else {
		turn_seconds = localStorage.turn_time - turn_seconds;
	}
	document.getElementById('turn-time-countdown').innerHTML = turn_seconds;
	document.getElementById('turn-time-countdown').style.color = '#CFD8DC';
	if (turn_seconds < 10) {
		document.getElementById('turn-time-countdown').style.color = '#C62828';
	}
	
	
	// Do animations
	this.animated = false;
	for (var i = 0; i < this.previous_moves.length; i++) {
		if (this.previous_moves[i].animated) {
			this.animated = true;
			this.previous_moves[i].update();
			
			// Wait for current animations to finish
			if (!this.previous_moves[i].animated) {
				this.updateNumberOfPieces();
			
				// Check if more jumps for the selected piece are available (multiple jump move)
				if (this.jumping) {
					this.checkMultiJump();
				}
			}
		}
	}
	
	for (var i = 0; i < this.removed_moves.length; i++) {
		if (this.removed_moves[i].animated) {
			this.animated = true;
			this.removed_moves[i].update();
			
			// Wait for current animations to finish
			if (!this.removed_moves[i].animated) {
				this.updateNumberOfPieces();
			}
		}
	}
	
	if (localStorage.undo === 'true') {
		localStorage.undo = false;
		
		if (!this.animated && this.previous_moves.length > 0) {
			this.previous_moves[this.previous_moves.length-1].undo();
			this.resetState();
			this.removed_moves.push(this.previous_moves[this.previous_moves.length-1]);
			this.previous_moves.splice(this.previous_moves.length-1, 1);
			this.previousPlayer();
			this.player_moves.splice(this.player_moves.length-1, 1);
		}
	}
}


GameState.prototype.saveGameToFile = function() {
	var string = "<dsx>";
	
	for (var i = 0; i < this.previous_moves.length; i++) {
		var move = this.previous_moves[i];
	
		string += "<move ";
		string += "from_x=\"" + move.from_x + "\" ";
		string += "from_y=\"" + move.from_y + "\" ";
		string += "to_x=\"" + move.to_x + "\" ";
		string += "to_y=\"" + move.to_y + "\" ";
		if (move.jump) {
			string += "jumped_to_x=\"" + move.jumped_to_x + "\" ";
			string += "jumped_to_y=\"" + move.jumped_to_y + "\" ";
		}
		string += "/>";
	}
	
	string += "</dsx>";
	
	document.getElementById('download').href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(string);
	document.getElementById('download').download = this.start_time.getTime() + ".dsx";
}












