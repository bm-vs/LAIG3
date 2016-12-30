/* RULES */

/*========================================================================================================================================*/

/* RESTRICTIONS */

% Two pieces with the same color can never be adjacent
restriction1(Player, Board, Column, Line) :-
	Right is Column+1, Left is Column-1, Top is Line-1, Bottom is Line+1,
	get_piece(Board, Top, Column, Piece0) , !,
	Piece0 \= Player,
	get_piece(Board, Bottom, Column, Piece1), !,
	Piece1 \= Player,
	get_piece(Board, Line, Right, Piece2), !,
	Piece2 \= Player,
	get_piece(Board, Line, Left, Piece3), !,
	Piece3 \= Player.

restriction1(Player, Board, Column, Line, NewColumn, NewLine) :-
	Right is NewColumn+1, Left is NewColumn-1, Top is NewLine-1, Bottom is NewLine+1,
	get_piece(Board, Top, NewColumn, Piece0) , !,
	((Column == NewColumn, Line == Top) -> (Piece0 == Player); (Piece0 \= Player)),
	get_piece(Board, Bottom, NewColumn, Piece1), !,
	((Column == NewColumn, Line == Bottom) -> (Piece1 == Player); (Piece1 \= Player)),
	get_piece(Board, NewLine, Right, Piece2), !,
	((Column == Right, Line == NewLine) -> (Piece2 == Player); (Piece2 \= Player)),
	get_piece(Board, NewLine, Left, Piece3), !,
	((Column == Left, Line == NewLine) -> (Piece3 == Player); (Piece3 \= Player)).


% Check if the piece is adjacent to one of the opponent's
check_adjacency(Player, Board, Column, Line, Adjacency) :-
	Right is Column+1, Left is Column-1, Top is Line-1, Bottom is Line+1,
	Other is ((Player mod 2) + 1),
	get_piece(Board, Top, Column, Piece0) , !,
	get_piece(Board, Bottom, Column, Piece1), !,
	get_piece(Board, Line, Right, Piece2), !,
	get_piece(Board, Line, Left, Piece3), !,
	(((Piece0 == Other); (Piece1 == Other); (Piece2 == Other); (Piece3 == Other)) -> (Adjacency='yes'); (Adjacency='no')).

% Check if the new position also as adjacencies
restriction2(Player, Board, Column, Line, 'no').

restriction2(Player, Board, Column, Line, 'yes') :-
	check_adjacency(Player, Board, Column, Line, Adjacency),
	Adjacency == 'yes'.


/*========================================================================================================================================*/
/* JUMP */

get_jump_positions(Player, Board, Column, Line, AvailableMoves) :-
	Other is ((Player mod 2) + 1),
	Empty is 0,
	check_jump_top(Player, Board, Column, Line, Other, Empty, Top),
	append(Top,[], Temp1),
	check_jump_left(Player, Board, Column, Line, Other, Empty, Left),
	append(Left, Temp1, Temp2),
	check_jump_right(Player, Board, Column, Line, Other, Empty, Right),
	append(Right, Temp2, Temp3),
	check_jump_bottom(Player, Board, Column, Line, Other, Empty, Bottom),
	append(Bottom, Temp3, AvailableMoves).

% Top
% Jump out
check_jump_top(Player, Board, Column, 1, Other, Empty, Top) :-
	get_piece(Board, 0, Column, Jumped),
	Jumped =:= Other,
	Top=[Column].

check_jump_top(Player, Board, Column, Line, Other, Empty, Top) :-
	L1 is Line-1, L2 is Line-2,
	restriction1(Player, Board, Column, L2),
	get_piece(Board, L1, Column, Jumped),
	Jumped =:= Other,
	get_piece(Board, L2, Column, Dest),
	Dest =:= Empty,
	T is (10*(Line-1)+Column),
	Top=[T].

check_jump_top(Player, Board, Column, Line, Other, Empty, Top) :- Top=[].

% Bottom
% Jump out
check_jump_bottom(Player, Board, Column, 8, Other, Empty, Bottom) :-
	get_piece(Board, 9, Column, Jumped),
	Jumped =:= Other,
	B is (90+Column),
	Bottom=[B].

check_jump_bottom(Player, Board, Column, Line, Other, Empty, Bottom) :-
	L1 is Line+1, L2 is Line+2,
	restriction1(Player, Board, Column, L2),
	get_piece(Board, L1, Column, Jumped),
	Jumped =:= Other,
	get_piece(Board, L2, Column, Dest),
	Dest =:= Empty,
	B is (10*(Line+1)+Column),
	Bottom=[B].

check_jump_bottom(Player, Board, Column, Line, Other, Empty, Bottom) :- Bottom=[].

% Left
% Jump out
check_jump_left(Player, Board, 1, Line, Other, Empty, Left) :-
	get_piece(Board, Line, 0, Jumped),
	Jumped =:= Other,
	L is (Line*10),
	Left=[L].

check_jump_left(Player, Board, Column, Line, Other, Empty, Left) :-
	C1 is Column-1, C2 is Column-2,
	restriction1(Player, Board, C2, Line),
	get_piece(Board, Line, C1, Jumped),
	Jumped =:= Other,
	get_piece(Board, Line, C2, Dest),
	Dest =:= Empty,
	L is (10*Line+Column-1),
	Left=[L].

check_jump_left(Player, Board, Column, Line, Other, Empty, Left) :- Left=[].

% Right
% Jump out
check_jump_right(Player, Board, 8, Line, Other, Empty, Right) :-
	get_piece(Board, Line, 9, Jumped),
	Jumped =:= Other,
	R is (Line*10+9),
	Right=[R].

check_jump_right(Player, Board, Column, Line, Other, Empty, Right) :-
	C1 is Column+1, C2 is Column+2,
	restriction1(Player, Board, C2, Line),
	get_piece(Board, Line, C1, Jumped),
	Jumped =:= Other,
	get_piece(Board, Line, C2, Dest),
	Dest =:= Empty,
	R is (10*Line+Column+1),
	Right=[R].

check_jump_right(Player, Board, Column, Line, Other, Empty, Right) :- Right=[].



/*========================================================================================================================================*/

/* ADJOIN */

get_adjoin_positions(Player, Board, Column, Line, AvailableMoves) :-
	PL is Line-1, NL is Line+1, PC is Column-1, NC is Column+1,
	check_no_ortogonal(Board, Column, Line),
	get_adjacency(Player, Board, NC, NL, BR),
	get_adjacency(Player, Board, NC, Line, R),
	get_adjacency(Player, Board, NC, PL, TR),
	get_adjacency(Player, Board, Column, NL, B),
	get_adjacency(Player, Board, Column, PL, T),
	get_adjacency(Player, Board, PC, NL, BL),
	get_adjacency(Player, Board, PC, Line, L),
	get_adjacency(Player, Board, PC, PL, TL),
	Lists=[BR,R,TR,B,T,BL,L,TL],
	append(Lists, AvailableMoves).

get_adjoin_positions(Player, Board, Column, Line, AvailableMoves) :- AvailableMoves=[].


check_no_ortogonal(Board, Column, Line) :-
	PL is Line-1, NL is Line+1, PC is Column-1, NC is Column+1,
	get_piece(Board, PL, Column, Piece1), !,
	(Piece1 =:= 0; Piece1 =:= 3),
	get_piece(Board, NL, Column, Piece2), !,
	(Piece2 =:= 0; Piece2 =:= 3),
	get_piece(Board, Line, NC, Piece3), !,
	(Piece3 =:= 0; Piece3 =:= 3),
	get_piece(Board, Line, PC, Piece4), !,
	(Piece4 =:= 0; Piece4 =:= 3).


get_adjacency(Player, Board, Column, Line, Position) :-
	get_piece(Board, Line, Column, Piece0),
	Piece0 =:= 0,
	Other is ((Player mod 2) + 1),
	PL is Line-1, NL is Line+1, PC is Column-1, NC is Column+1,
	get_piece(Board, PL, Column, Piece1),
	get_piece(Board, NL, Column, Piece2),
	get_piece(Board, Line, NC, Piece3),
	get_piece(Board, Line, PC, Piece4),
	(Piece1 =:= Other; Piece2 =:= Other; Piece3 =:= Other; Piece4 =:= Other),
	P is Line*10+Column,
	Position=[P].

get_adjacency(Player, Board, Column, Line, Position) :- Position=[].


/*========================================================================================================================================*/

/* CENTERING */

get_center_positions(Player, Board, Column, Line, AvailableMoves) :-
	PL is Line-1, NL is Line+1, PC is Column-1, NC is Column+1,
	Dist is sqrt(abs(Column-4.5)^2+abs(Line-4.5)^2),
	check_adjacency(Player, Board, Column, Line, Adjacency),
	get_closer(Player, Board, Dist, Column, Line, NC, NL, BR, Adjacency),
	get_closer(Player, Board, Dist, Column, Line, NC, Line, R, Adjacency),
	get_closer(Player, Board, Dist, Column, Line, NC, PL, TR, Adjacency),
	get_closer(Player, Board, Dist, Column, Line, Column, NL, B, Adjacency),
	get_closer(Player, Board, Dist, Column, Line, Column, PL, T, Adjacency),
	get_closer(Player, Board, Dist, Column, Line, PC, NL, BL, Adjacency),
	get_closer(Player, Board, Dist, Column, Line, PC, Line, L, Adjacency),
	get_closer(Player, Board, Dist, Column, Line, PC, PL, TL, Adjacency),
	Lists=[BR,R,TR,B,T,BL,L,TL],
	append(Lists, AvailableMoves).

get_closer(Player, Board, Dist, Column, Line, NewColumn, NewLine, Position, Adjacency) :-
	get_piece(Board, NewLine, NewColumn, Piece),
	Piece =:= 0,
	restriction1(Player, Board, Column, Line, NewColumn, NewLine),
	restriction2(Player, Board, NewColumn, NewLine, Adjacency),
	NewDist is sqrt(abs(NewColumn-4.5)^2+abs(NewLine-4.5)^2),
	NewDist < Dist,
	P is NewLine*10+NewColumn,	
	Position=[P].

get_closer(Player, Board, Dist, Column, Line, NewColumn, NewLine, Position, Adjacency) :- Position=[].
