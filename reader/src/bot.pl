/* BOT */

/* Choose move on the given board randomly */
random_position_from(Player, Board, Column, Line, JumpMoves, AdjoinMoves, CenterMoves) :-
	random(0, 10, CNumber),
	random(0, 10, LNumber),
	get_piece(Board, LNumber, CNumber, Piece),
	Piece =:= Player,
	get_jump_positions(Player, Board, CNumber, LNumber, JM),
	get_adjoin_positions(Player, Board, CNumber, LNumber, AM),
	get_center_positions(Player, Board, CNumber, LNumber, CM),
	Pos is LNumber*10+CNumber,
	(JM \= []; AM \= []; CM \= []),
	Column is CNumber,
	Line is LNumber,
	JumpMoves=JM,
	AdjoinMoves=AM,
	CenterMoves=CM.


random_position_from(Player, Board, Column, Line, JumpMoves, AdjoinMoves, CenterMoves) :- random_position_from(Player, Board, Column, Line, JumpMoves, AdjoinMoves, CenterMoves).



random_position_to(Player, Board, Column, Line, JumpMoves, AdjoinMoves, CenterMoves, Move) :-
	random(0, 10, CNumber),
	random(0, 10, LNumber),
	Pos is LNumber*10+CNumber,
	(member(Pos, AdjoinMoves) -> (Move='adjoin');
		member(Pos, CenterMoves) -> (Move='center');
			member(Pos, JumpMoves) -> (Move='jump')),
	Column is CNumber,
	Line is LNumber.
	
random_position_to(Player, Board, Column, Line, JumpMoves, AdjoinMoves, CenterMoves, Move) :- random_position_to(Player, Board, Column, Line, JumpMoves, AdjoinMoves, CenterMoves, Move).
