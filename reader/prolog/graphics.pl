/* GRAPHICS */

/* Print board */
/* parameters: Size - of list; Board - list that represents the board */
print_board(Size, Board) :-
	nl, 
	print_letters(Size, Size),
	print_top_lines(Size),
	print_squares(0, Size, Board),
	print_bottom_lines(Size).


/* Print letters on top of the board */
print_letters(Size, Size) :- 
	Size > 0,
	write('    '),
	print_letter(Size, Size).

print_letter(1, Size) :-
	write(' '),
	C is 65+Size-1,
	put_code(C),
	write(' '), nl.

print_letter(Line, Size) :-
	write(' '),
	C is 65+Size-Line,
	put_code(C),
	write(' '),
	Nextline is Line-1,
	print_letter(Nextline,Size).


/* Print the top line of the board */
print_top_lines(Column) :-
	Column > 0,
	write('    '),
	lt_corner,
	print_top_line(Column).

print_top_line(1) :-
	horiz,
	horiz,
	rt_corner, nl.

print_top_line(Column) :-
	horiz,
	horiz,
	top_con,
	Nextcolumn is Column-1,
	print_top_line(Nextcolumn).


/* Print the bottom line line of the board */
print_bottom_lines(Column) :-
	Column > 0,
	write('    '),
	lb_corner,
	print_bottom_line(Column).

print_bottom_line(1) :-
	horiz,
	horiz,
	rb_corner, nl.

print_bottom_line(Column) :-
	horiz,
	horiz,
	bottom_con,
	Nextcolumn is Column-1,
	print_bottom_line(Nextcolumn).


/* Print the middle of the board */
print_squares(Currentline, Size, []).

print_squares(0, Size, [Line|Board]) :-
	print_pieces(0, Size, Line),
	print_squares(1, Size, Board).

print_squares(Currentline, Size, [Line|Board]) :-
	print_middle_lines(Size),
	print_pieces(Currentline, Size, Line),
	Nextline is Currentline+1,
	print_squares(Nextline, Size, Board).


/* Print the horizontal lines and connectors of the board */
print_middle_lines(Size) :- 
	Size > 0,
	write('    '),
	left_con,
	print_middle_line(Size).

print_middle_line(1) :- 
	horiz,
	horiz,
	right_con, nl.

print_middle_line(Size) :- 
	horiz,
	horiz,
	middle,
	Nextsize is Size-1,
	print_middle_line(Nextsize).


/* Print the pieces and the vertical lines */
print_pieces(Currline, Nrline, Line) :-
	write('  '),
	write(Currline),
	write(' '),
	print_piece(Line),
	vert, nl.

print_piece([]).

print_piece([0|Line]) :-
	vert,
	write('  '),
	print_piece(Line).

print_piece([1|Line]) :-
	vert,
	black_circle,
	write(' '),
	print_piece(Line).

print_piece([2|Line]) :-
	vert,
	white_circle,
	write(' '),
	print_piece(Line).


/* Characteres */

lt_corner :- put_code(9484).
rt_corner :- put_code(9488).
lb_corner :- put_code(9492).
rb_corner :- put_code(9496).
horiz :- put_code(9472).
vert :- put_code(9474).
top_con :- put_code(9516).
bottom_con :- put_code(9524).
left_con :- put_code(9500).
right_con :- put_code(9508).
middle :- put_code(9532).

double_lt_corner :- put_code(9556).
double_rt_corner :- put_code(9559).
double_lb_corner :- put_code(9562).
double_rb_corner :- put_code(9565).
double_vert :- put_code(9553).
double_horiz :- put_code(9552).
double_left_con :- put_code(9568).
double_right_con :- put_code(9571).

black_circle :- put_code(11044).
white_circle :- put_code(11093).%put_code(9711).

double_horiz(0).
double_horiz(N) :- double_horiz, N1 is N-1, double_horiz(N1).

space(0).
space(N) :- write(' '), N1 is N-1, space(N1).
