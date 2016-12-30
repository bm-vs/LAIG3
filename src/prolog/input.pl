/* READ GAME MODE */

get_menu_input(Option, Min, Max) :-
	get_code(O), skip_line,
	O > 47+Min, O < 49+Max,
	Option is O.

get_menu_input(Option, Min, Max) :- get_menu_input(Option, Min, Max).


/* READ POSITION */

read_position_from(Player, Board, Column, Line, JumpMoves, AdjoinMoves, CenterMoves) :-
	write('From '),
	get_code(C),
	get_code(L), skip_line,
	C > 64, C < 75,
	L > 47, L < 58,
	CNumber is C - 65,
	LNumber is L - 48,
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
	
read_position_from(Player, Board, Column, Line, JumpMoves, AdjoinMoves, CenterMoves) :- read_position_from(Player, Board, Column, Line, JumpMoves, AdjoinMoves, CenterMoves).
	

read_position_to(Player, Board, Column, Line, JumpMoves, AdjoinMoves, CenterMoves, Move) :-
	write('To   '),
	get_code(C),
	get_code(L), skip_line,
	C > 64, C < 75,
	L > 47, L < 58,
	CNumber is C - 65,
	LNumber is L - 48,
	Pos is LNumber*10+CNumber,
	(member(Pos, AdjoinMoves) -> (Move='adjoin');
		member(Pos, CenterMoves) -> (Move='center');
			member(Pos, JumpMoves) -> (Move='jump')),
	Column is CNumber,
	Line is LNumber.
	
read_position_to(Player, Board, Column, Line, JumpMoves, AdjoinMoves, CenterMoves, Move) :- read_position_to(Player, Board, Column, Line, JumpMoves, AdjoinMoves, CenterMoves, Move).
