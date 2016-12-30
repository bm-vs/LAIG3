:-use_module(library(sockets)).
:-use_module(library(lists)).
:-use_module(library(codesio)).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%                                        Server                                                   %%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% To run, enter 'server.' on sicstus command line after consulting this file.
% You can test requests to this server by going to http://localhost:8081/<request>.
% Go to http://localhost:8081/quit to close server.

% Made by Luis Reis (ei12085@fe.up.pt) for LAIG course at FEUP.

port(8081).

% Server Entry Point
server :-
	port(Port),
	write('Opened Server'),nl,nl,
	socket_server_open(Port, Socket),
	server_loop(Socket),
	socket_server_close(Socket),
	write('Closed Server'),nl.

% Server Loop 
% Uncomment writes for more information on incomming connections
server_loop(Socket) :-
	repeat,
	socket_server_accept(Socket, _Client, Stream, [type(text)]),
		% write('Accepted connection'), nl,
	    % Parse Request
		catch((
			read_request(Stream, Request),
			read_header(Stream)
		),_Exception,(
			% write('Error parsing request.'),nl,
			close_stream(Stream),
			fail
		)),
		
		% Generate Response
		handle_request(Request, MyReply, Status),
		format('Request: ~q~n',[Request]),
		format('Reply: ~q~n', [MyReply]),
		
		% Output Response
		format(Stream, 'HTTP/1.0 ~p~n', [Status]),
		format(Stream, 'Access-Control-Allow-Origin: *~n', []),
		format(Stream, 'Content-Type: text/plain~n~n', []),
		format(Stream, '~p', [MyReply]),
	
		% write('Finnished Connection'),nl,nl,
		close_stream(Stream),
	(Request = quit), !.
	
close_stream(Stream) :- flush_output(Stream), close(Stream).

% Handles parsed HTTP requests
% Returns 200 OK on successful aplication of parse_input on request
% Returns 400 Bad Request on syntax error (received from parser) or on failure of parse_input
handle_request(Request, MyReply, '200 OK') :- catch(parse_input(Request, MyReply),error(_,_),fail), !.
handle_request(syntax_error, 'Syntax Error', '400 Bad Request') :- !.
handle_request(_, 'Bad Request', '400 Bad Request').

% Reads first Line of HTTP Header and parses request
% Returns term parsed from Request-URI
% Returns syntax_error in case of failure in parsing
read_request(Stream, Request) :-
	read_line(Stream, LineCodes),
	print_header_line(LineCodes),
	
	% Parse Request
	atom_codes('GET /',Get),
	append(Get,RL,LineCodes),
	%read_request_aux(RL,RL2),	
	
	%catch(read_from_codes(RL2, Request), error(syntax_error(_),_), fail), !.
	catch(read_request_aux(RL,Request), error(syntax_error(_),_), fail), !.

read_request(_,syntax_error).
	
read_request_aux([32|_],[]) :- !.
read_request_aux([C|Cs],[C|RCs]) :- read_request_aux(Cs, RCs).


% Reads and Ignores the rest of the lines of the HTTP Header
read_header(Stream) :-
	repeat,
	read_line(Stream, Line),
	print_header_line(Line),
	(Line = []; Line = end_of_file),!.

check_end_of_header([]) :- !, fail.
check_end_of_header(end_of_file) :- !,fail.
check_end_of_header(_).

% Function to Output Request Lines (uncomment the line bellow to see more information on received HTTP Requests)
% print_header_line(LineCodes) :- catch((atom_codes(Line,LineCodes),write(Line),nl),_,fail), !.
print_header_line(_).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%                                       Commands                                                  %%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% Require your Prolog Files here

:- ensure_loaded('rules.pl').
:- ensure_loaded('utilities.pl').

% RequestString processing
parse_input(Request, Response) :-
	getStringUntil(Request, Tmp1, RequestType, 45),
	getStringUntil(Tmp1, Tmp2, Board, 45),
	getStringUntil(Tmp2, Tmp3, Coord, 45),
	getStringUntil(Tmp3, Tmp4, Player, 0),
	charToInt(RequestType, RT), 
	charToInt(Board, B),
	charToInt(Coord, C),
	charToInt(Player, P),
	getRequest(RT, RequestNumber),
	getBoard(B, RequestBoard, 0),
	nth0(0, C, RequestColumn),
	nth0(1, C, RequestLine),
	RequestPlayer is P,
	processRequest(RequestNumber, RequestBoard, RequestColumn, RequestLine, RequestPlayer, Response).


getStringUntil([], [], RequestType, Limit) :- RequestType=[].
getStringUntil([Limit|NewList], NewList, RequestType, Limit) :- RequestType=[].
getStringUntil([N|Rest], NewList, RequestType, Limit) :-
	getStringUntil(Rest, NewList, Tmp, Limit),
	append([N], Tmp, RequestType).

getStringUntil([], [], RequestType, CurrN, Limit) :- RequestType=[].
getStringUntil(NewList, NewList, RequestType, Limit, Limit) :- RequestType=[].
getStringUntil([N|Rest], NewList, RequestType, CurrN, Limit) :-
	NextN is CurrN+1,
	getStringUntil(Rest, NewList, Tmp, NextN, Limit),
	append([N], Tmp, RequestType).


charToInt([], RT) :- RT=[].
charToInt([H|T], RT) :-
	charToInt(T, Tmp),
	N is H-48,
	append([N], Tmp, RT).

getRequest(List, Number) :-
	nth0(0, List, H),
	nth0(1, List, D),
	nth0(2, List, U),
	Number is H*100+D*10+U.

getBoard(B, RequestBoard, 10) :- RequestBoard=[].
getBoard(B, RequestBoard, N) :-
	getStringUntil(B, Tmp, Line, 0, 10),
	N1 is N+1,
	getBoard(Tmp, NewB, N1),
	append([Line], NewB, RequestBoard).

% Return available moves according to rules
processRequest(100, Board, Column, Line, Player, Response) :-
	get_jump_positions(Player, Board, Column, Line, Response),
	Response \= [].
processRequest(100, Board, Column, Line, Player, []).

processRequest(200, Board, Column, Line, Player, Response) :-
	get_adjoin_positions(Player, Board, Column, Line, Response),
	Response \= [].
processRequest(200, Board, Column, Line, Player, []).

processRequest(300, Board, Column, Line, Player, Response) :-
	get_center_positions(Player, Board, Column, Line, Response),
	Response \= [].
processRequest(300, Board, Column, Line, Player, []).

processRequest(_, _, _, _, _, []).



