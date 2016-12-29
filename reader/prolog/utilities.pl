/* UTILITIES */

/* Check if Elem is in a 2d List */
member2d(Elem, []) :- fail.

member2d(Elem, [Line|List2d]) :-
	(member(Elem, Line) -> true; member2d(Elem, List2d)).

/* Return the elem in a 2d list position; return 3 if out of list position */
get_piece(Board, Line, Column, Piece) :-
	nth0(Line, Board, PieceLine), /* get the line of the piece */
	nth0(Column, PieceLine, Piece). /* get the piece ID to be moved */

get_piece(Board, Line, Column, Piece) :- Piece is 3.


/* On a 2d list, moves value at initial position to final position */
move(Board, NewBoard, InitialColumn, InitialLine, FinalColumn, FinalLine) :-
	get_piece(Board, InitialLine, InitialColumn, Piece),
	change_board_position(Board, NewBoardTemp, 0, InitialColumn, InitialLine, 0),
	change_board_position(NewBoardTemp, NewBoard, 0, FinalColumn, FinalLine, Piece).


/* Changes the position ColumnNr, LineNr of a 2d list to Piece */
change_board_position([], [], Count, ColumnNr, LineNr, Piece).

change_board_position([Line|Board], [Line|NewBoard], Count, ColumnNr, LineNr, Piece) :-
	Count \= LineNr,
	NextCount is Count+1,
	change_board_position(Board, NewBoard, NextCount, ColumnNr, LineNr, Piece).

change_board_position([Line|Board], NewBoard, Count, ColumnNr, LineNr, Piece) :- 
	change_line_position(Line, NewLine, 0, ColumnNr, Piece),
	NextCount is Count+1,
	change_board_position([NewLine|Board], NewBoard, NextCount, ColumnNr, LineNr, Piece).


/* Changes the position ColumnNr of a list to Piece */
change_line_position([], [], Count, ColumnNr, Piece).

change_line_position([Position|Line], [Position|NewLine], Count, ColumnNr, Piece) :-
	Count \= ColumnNr,
	NextCount is Count+1,
	change_line_position(Line, NewLine, NextCount, ColumnNr, Piece).

change_line_position([Position|Line], [Piece|NewLine], Count, ColumnNr, Piece) :-
	NextCount is Count+1,
	change_line_position(Line, NewLine, NextCount, ColumnNr, Piece).
