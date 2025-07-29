const tictactoe_component = ( game, bDisabled, onMoveComplete ) => {
    const boardSelector = 'div#game_board';

    // Set up the game board
    renderBoard( game, bDisabled );

    function renderBoard( game, bDisabled ) {
        // The current state of the board, all nine cells
        var boardState = [
            '', '', '',
            '', '', '',
            '', '', ''
        ];

        // Set the state of the board from the game's move data
        if( game.move_data?.length > 0 ) {
            for( var n = 0; n < game.move_data.length; ++n ) {
                let nthMove = game.move_data[n];

                boardState[nthMove.pos] = nthMove.piece;
            }
        }

        const boardElem = document.querySelector( boardSelector );
        if( ! boardElem ) {
            throw 'Unable to find board element for tic tac toe';
        }

        while( boardElem.firstChild )
            boardElem.removeChild( boardElem.firstChild );
        
        if( game.status == 'finished' ) {
            const loadingTempl = [`
                <span>This game has finished. Winner: ${game.result}</span>
                <br />`];

            boardElem.appendChild( parseTemplate( loadingTempl ) );
            // return;
        }

        const payload = [`
            <div id="tictactoe">
                <h1>
                    Tic Tac Toe!
                </h1>

                <br />

                <table id="tictactoe_board">
                    <tr>
                        <td>${boardState[0]}</td>
                        <td>${boardState[1]}</td>
                        <td>${boardState[2]}</td>
                    </tr>
                    <tr>
                        <td>${boardState[3]}</td>
                        <td>${boardState[4]}</td>
                        <td>${boardState[5]}</td>
                    </tr>
                    <tr>
                        <td>${boardState[6]}</td>
                        <td>${boardState[7]}</td>
                        <td>${boardState[8]}</td>
                    </tr>
                </table>
            </div>
            <br />
        `];
        
        boardElem.appendChild( parseTemplate( payload ) );

        const tds = document.querySelectorAll( 'table#tictactoe_board tr td' );
        if( tds.length != 9 ) {
            throw 'Unable to find all nine TDs for the the tictactoe board';
        }

        let nextPiece = ( game.status == 'individual' )? 'X': 'O';

        if( game.status !== 'finished' && ! bDisabled ) {
            for( var n = 0; n < boardState.length; ++n ) {
                // Only plug into the cells with no move's onclick event
                if( ! boardState[n] && ! bDisabled ) {
                    // Make an anonymous function call here to keep the value of n
                    let newN = n;
                    tds[n].addEventListener( 'click', () => addMove( newN, nextPiece ) );
                    tds[n].style.cursor = 'pointer';
                }
            }
        }

        // Adds a move to the board. This assumes the frame work's
        // move token check passed.
        // pos: int 0-8 The positions on the board
        // piece: X or O
        function addMove( pos, piece ) {
            // Verify that it's a valid move
            if( ! boardState[pos] ) {
                tds[pos].innerHTML = nextPiece;
                boardState[pos] = nextPiece;

                let packet = generateWSPacket( { 
                    action: 'move',
                    game_id: game.id,
                    moveData: {
                        pos: pos,
                        piece: piece
                    }
                } );

                ws.send( packet );
                
                if( typeof onMoveComplete == 'function' ) {
                    // Tell the framework this move is complete
                    onMoveComplete();
                }
            }
        };
    }
}