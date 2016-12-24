function GameState(scene) {
	this.scene = scene;
	this.board = new Board(scene);
	var id = 0;
	this.pieces = [];
	for (var line = 0; line < 10; line++) {
		for (column = 0; column < 10; column++) {
			this.pieces[id] = new Piece(scene, id+1, column, line);
			id++;
		}
	}

	this.state = 
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

	this.current_player = 1;
	this.selected_piece = null;
}

GameState.prototype.display = function() {
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


GameState.prototype.processPick = function(picked_obj) {

	//var customId = this.pickResults[i][1];
	var board = this.state;
	var coord = [picked_obj.x, picked_obj.y];
	
	if (picked_obj instanceof Piece) {
		// Player picks own piece -> piece selected
		if (picked_obj.player == this.current_player) {
			this.selected_piece = picked_obj;
			var request_string = this.createRequestString('100', board, coord, this.current_player);
			var jump_moves = makeRequest(request_string);
			console.log(jump_moves.response);

			request_string = this.createRequestString('200', board, coord, this.current_player);
			var adjoin_moves = makeRequest(request_string);
			console.log(adjoin_moves.response);

			request_string = this.createRequestString('300', board, coord, this.current_player);
			var center_moves = makeRequest(request_string);
			console.log(center_moves.response);
		}

		// Player picks opponents piece -> jump
		if (this.selected_piece != null) {
			//var request = makeRequest(customId);
		}
	}
	else if (picked_obj instanceof Tile){
		// Player picks tile -> adjoin/center
		if (this.selected_piece != null) {
			//var request = makeRequest(customId);
		}
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
