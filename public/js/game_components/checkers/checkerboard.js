/**
 * 
 * @param {obj} game The game data
 * @param {HTMLElement} container The HTML element to render the board into
 * @param {function} onMoveComplete Called after the game executes a move
 * @returns A set of methods to interact with the rendered game
 */
function checkerBoard( game, container, onMoveComplete ) {
    this.generateEmptyBoard = () => {
        const board = [];
        for( var n = 0; n < 8; ++n ) {
            board.push( [ null, null, null, null,
                          null, null, null, null ] );
        }

        // Put the starting pieces onto the board
        board[0][0] = { king: false, color: 'W' };
        board[0][2] = { king: false, color: 'W' };
        board[0][4] = { king: false, color: 'W' };
        board[0][6] = { king: false, color: 'W' };
        
        board[1][1] = { king: false, color: 'W' };
        board[1][3] = { king: false, color: 'W' };
        board[1][5] = { king: false, color: 'W' };
        board[1][7] = { king: false, color: 'W' };

        board[2][0] = { king: false, color: 'W' };
        board[2][2] = { king: false, color: 'W' };
        board[2][4] = { king: false, color: 'W' };
        board[2][6] = { king: false, color: 'W' };

        board[5][1] = { king: false, color: 'B' };
        board[5][3] = { king: false, color: 'B' };
        board[5][5] = { king: false, color: 'B' };
        board[5][7] = { king: false, color: 'B' };
        
        board[6][0] = { king: false, color: 'B' };
        board[6][2] = { king: false, color: 'B' };
        board[6][4] = { king: false, color: 'B' };
        board[6][6] = { king: false, color: 'B' };

        board[7][1] = { king: false, color: 'B' };
        board[7][3] = { king: false, color: 'B' };
        board[7][5] = { king: false, color: 'B' };
        board[7][7] = { king: false, color: 'B' };


        return board;

    };

    // The game data
    this.game = game;

    // The HTML Element that will container the UI for the board
    this.container = container;

    this.onMoveComplete = onMoveComplete;

    // The current move the user is viewing
    this.current_move = 0;

    // Create the board structure
    this.board = this.generateEmptyBoard();
    
    var resultText = '';
    if( game.status == 'finished' ) {
        resultText = `<h3>This game has finished. Winner: ${game.result}</h3>`;
    }
        

    this.renderBoardDOM = () => {
        const payload = [`
            <div id="checkers">
                <h1>
                    Checkers!
                </h1>                
                <br />

                ${resultText}

                <div id="checker_board">
                    <span class="board_row">
                        <span class="board_cell" id="board_cell_0x0"></span>
                        <span class="board_cell" id="board_cell_0x1"></span>
                        <span class="board_cell" id="board_cell_0x2"></span>
                        <span class="board_cell" id="board_cell_0x3"></span>
                        <span class="board_cell" id="board_cell_0x4"></span>
                        <span class="board_cell" id="board_cell_0x5"></span>
                        <span class="board_cell" id="board_cell_0x6"></span>
                        <span class="board_cell" id="board_cell_0x7"></span>
                    </span>
                    <span class="board_row">
                        <span class="board_cell" id="board_cell_1x0"></span>
                        <span class="board_cell" id="board_cell_1x1"></span>
                        <span class="board_cell" id="board_cell_1x2"></span>
                        <span class="board_cell" id="board_cell_1x3"></span>
                        <span class="board_cell" id="board_cell_1x4"></span>
                        <span class="board_cell" id="board_cell_1x5"></span>
                        <span class="board_cell" id="board_cell_1x6"></span>
                        <span class="board_cell" id="board_cell_1x7"></span>
                    </span>
                    <span class="board_row">
                        <span class="board_cell" id="board_cell_2x0"></span>
                        <span class="board_cell" id="board_cell_2x1"></span>
                        <span class="board_cell" id="board_cell_2x2"></span>
                        <span class="board_cell" id="board_cell_2x3"></span>
                        <span class="board_cell" id="board_cell_2x4"></span>
                        <span class="board_cell" id="board_cell_2x5"></span>
                        <span class="board_cell" id="board_cell_2x6"></span>
                        <span class="board_cell" id="board_cell_2x7"></span>
                    </span>
                    <span class="board_row">
                        <span class="board_cell" id="board_cell_3x0"></span>
                        <span class="board_cell" id="board_cell_3x1"></span>
                        <span class="board_cell" id="board_cell_3x2"></span>
                        <span class="board_cell" id="board_cell_3x3"></span>
                        <span class="board_cell" id="board_cell_3x4"></span>
                        <span class="board_cell" id="board_cell_3x5"></span>
                        <span class="board_cell" id="board_cell_3x6"></span>
                        <span class="board_cell" id="board_cell_3x7"></span>
                    </span>
                    <span class="board_row">
                        <span class="board_cell" id="board_cell_4x0"></span>
                        <span class="board_cell" id="board_cell_4x1"></span>
                        <span class="board_cell" id="board_cell_4x2"></span>
                        <span class="board_cell" id="board_cell_4x3"></span>
                        <span class="board_cell" id="board_cell_4x4"></span>
                        <span class="board_cell" id="board_cell_4x5"></span>
                        <span class="board_cell" id="board_cell_4x6"></span>
                        <span class="board_cell" id="board_cell_4x7"></span>
                    </span>
                    <span class="board_row">
                        <span class="board_cell" id="board_cell_5x0"></span>
                        <span class="board_cell" id="board_cell_5x1"></span>
                        <span class="board_cell" id="board_cell_5x2"></span>
                        <span class="board_cell" id="board_cell_5x3"></span>
                        <span class="board_cell" id="board_cell_5x4"></span>
                        <span class="board_cell" id="board_cell_5x5"></span>
                        <span class="board_cell" id="board_cell_5x6"></span>
                        <span class="board_cell" id="board_cell_5x7"></span>
                    </span>
                    <span class="board_row">
                        <span class="board_cell" id="board_cell_6x0"></span>
                        <span class="board_cell" id="board_cell_6x1"></span>
                        <span class="board_cell" id="board_cell_6x2"></span>
                        <span class="board_cell" id="board_cell_6x3"></span>
                        <span class="board_cell" id="board_cell_6x4"></span>
                        <span class="board_cell" id="board_cell_6x5"></span>
                        <span class="board_cell" id="board_cell_6x6"></span>
                        <span class="board_cell" id="board_cell_6x7"></span>
                    </span>
                    <span class="board_row">
                        <span class="board_cell" id="board_cell_7x0"></span>
                        <span class="board_cell" id="board_cell_7x1"></span>
                        <span class="board_cell" id="board_cell_7x2"></span>
                        <span class="board_cell" id="board_cell_7x3"></span>
                        <span class="board_cell" id="board_cell_7x4"></span>
                        <span class="board_cell" id="board_cell_7x5"></span>
                        <span class="board_cell" id="board_cell_7x6"></span>
                        <span class="board_cell" id="board_cell_7x7"></span>
                    </span>                    
                </div>
                <div id="game_controls">
                    <button class="first" title="First Move">First</button>
                    <button class="prev" title="Previous Move"><< Prev</button>
                    <button class="next" title="Next Move">Next >></button>
                    <button class="last" title="Last Move">Last</button>
                </div>
            </div>
            <br />
        `];

        this.container.appendChild( parseTemplate( payload ) );
    }


    this.renderPieces = () => {
        document.querySelectorAll( 'span.piece' ).forEach( ( el ) => {
            el.classList.remove( 'piece' );
        } );

        document.querySelectorAll( 'span.king' ).forEach( ( el ) => {
            el.classList.remove( 'king' );
        } );

        document.querySelectorAll( 'span.piece_B' ).forEach( ( el ) => {
            el.classList.remove( 'piece_B' );
        } );

        document.querySelectorAll( 'span.piece_W' ).forEach( ( el ) => {
            el.classList.remove( 'piece_W' );
        } );

        // Clear any existing dom events / pieces
        for( let x = 0; x < 8; ++x ) {
            for( let y = 0; y < 8; ++y ) {
                let elem = document.querySelector( `#board_cell_${x}x${y}` );
                if( elem ) {
                    elem.onclick = null;
                    elem.innerHTML = null;
                }
            }
        }

        // Loop over the board and display any/all pieces
        for( var x = 0; x < 8; x++ ) {
            for( var y = 0; y < 8; y++ ) {
                if( this.board[x][y] !== null ) {
                    let elem = document.querySelector( `#board_cell_${x}x${y}` );
                    if( elem ) {
                        elem.classList.add( 'piece_' + this.board[x][y].color );
                        elem.classList.add( 'piece' );

                        if( this.board[x][y].king )
                            elem.classList.add( 'king' );

                        let pos = { x: x, y: y };

                        // Need to be able to tell whether this is the game's owner
                        // in order to not allow them to click and move pieces out of trun
                        // This only happens on the front end, the back end rejects it
                        // without a move token

                        // Set the onClick event based on the game's current status, if the 
                        // game is on the most recent move and the game is not over
                        if( this.game.status != 'finished' &&
                            this.current_move == this.game.move_data?.length )
                        {
                            if( game.status == 'individual' && this.board[x][y].color == 'B' ) {
                                elem.onclick = () => this.pieceClick( elem, pos ); 
                                elem.classList.add( 'clickable' );
                            } 
                            else if( game.status == 'collective' && this.board[x][y].color == 'W' &&
                                userDetails.user_id != game.owner_id ) {
                                elem.onclick = () => this.pieceClick( elem, pos ); 
                                elem.classList.add( 'clickable' );
                            }
                        }
                    }
                }
            }
        }
    };

    this.cleanBoardDom = () => {
        let allActive = this.container.querySelectorAll( 'span.active' );
        if( allActive.length > 0 )
            allActive.forEach( ( el ) => { el.classList.remove( 'active' ) } );

        let allMoveTargets = this.container.querySelectorAll( 'span.move_target' );
        if( allMoveTargets.length > 0 ) {
            allMoveTargets.forEach( ( el ) => {
                el.classList.remove( 'move_target', 'clickable' );
                el.onclick = null;
            } );
        }
    };

    /**
     * Called when a piece on the board is clicked
     * @param {*} elem The html element for the clicked piece
     * @param {*} pos {x,y} The x,y position of the piece on the board
     * @param {*} captures Array of pieces that will be captured when this move is executed
     */
    this.pieceClick = ( elem, pos ) => {
        this.cleanBoardDom();

        elem.classList.add( 'active' );

        // Get any/all potential from the active piece
        const potentialMoves = this.findPotentialMoves( pos );
        potentialMoves.forEach( ( movePos ) => {

            let boardCell = document.querySelector( `#board_cell_${movePos.x}x${movePos.y}` );
            if( boardCell ) {
                let captures = movePos.captures? movePos.captures: [];
                boardCell.onclick = () => { 
                    this.executeMove( pos, movePos, captures );
                    this.renderPieces();
                }
                boardCell.classList.add( 'move_target' );
            }
        } );
    }


    /**
     * Returns a list of x,y board positions that are valid moves by the
     * piece
     * 
     * @param from: object {x,y}
     * @param bCapturesOnly: boolean. If true, this method will ignore
     *          simple moves to neighboring spaces (for recursion)
     * @param captures: array Holds any captures found, for recursion
     */
    this.findPotentialMoves = ( from, bCapturesOnly, captures ) => {
        if( ! from || from.x === undefined || ! from.y === undefined ||
            from.x < 0 || from.x > 7 || from.y < 0 || from.y > 7 ) {
                return [];
                // throw 'findPotentialMoves called with from = ' + from;
        }

        // Make sure the captures array is set
        if( ! captures ) captures = [];

        const piece = this.board[from.x][from.y];

        // Direction non kings can move
        // w: +x
        // b: -x
        const slopes = [
            { x: 1,  y: 1 },  // W
            { x: 1,  y: -1 }, // W
            { x: -1, y: 1 },  // B
            { x: -1, y: -1 }  // B 
        ];

        let relevantSlopes = [];

        if( piece.king )
            relevantSlopes = slopes;
        else {
            if( piece.color == 'B' ) {
                relevantSlopes.push( slopes[2] );
                relevantSlopes.push( slopes[3] );
            }

            if( piece.color == 'W' ) {
                relevantSlopes.push( slopes[0] );
                relevantSlopes.push( slopes[1] );
            }
        }

        // Determine all potential moves
        const potentialMoves = [];
        
        for( let n = 0; n < relevantSlopes.length; ++n ) {
            let loopCaptures = captures.slice(0);

            let slope = relevantSlopes[n];

            let slopeX = from.x + slope.x;
            let slopeY = from.y + slope.y;

            // If there is an empty space to move onto
            if( ! bCapturesOnly && this.board[slopeX] && ! this.board[slopeX][slopeY] ) {
                potentialMoves.push( {x: slopeX, y: slopeY} );
            }

            let extdSlopeX = slopeX + slope.x;
            let extdSlopeY = slopeY + slope.y;

            // If there is a piece, can we capture it (opposite color and empty space to land)
            if( extdSlopeX >= 0 && extdSlopeX < 8 && extdSlopeY >= 0 && extdSlopeY < 8 &&
                this.board[slopeX] && this.board[slopeX][slopeY] && 
                this.board[slopeX][slopeY].color != piece.color && 
                this.board[extdSlopeX] && ! this.board[extdSlopeX][extdSlopeY] ) {

                    loopCaptures.push( {x: slopeX, y: slopeY} );
                    potentialMoves.push( {x: extdSlopeX, y: extdSlopeY, captures: loopCaptures.slice(0)} );

                    // Determine if the space landed on after the capture allows
                    // for another jump
                    let oldPiece =  this.board[extdSlopeX][extdSlopeY];
                    this.board[extdSlopeX][extdSlopeY] = piece;
                    potentialMoves.push( ...this.findPotentialMoves( {x: extdSlopeX, y: extdSlopeY}, 
                                                                    true,
                                                                    loopCaptures.slice(0) ) );
                    this.board[extdSlopeX][extdSlopeY] = oldPiece;
            }

        }

        return potentialMoves;
    }

    /**
     * "Replays" a move, used in place of execute move when
     * loading a game.
     * @param {object} from {x, y}
     * @param {object} to {x, y} 
     * @param {array} captures An array of x/y positions of captures
     */
    this.replayMove = ( from, to, captures ) => {
        let piece = this.board[to.x][to.y] = this.board[from.x][from.y];
        this.board[from.x][from.y] = null;

        // Promote to king if a piece is on the furthest line
        if( piece.color == 'W' && to.x == 7 ) {
            piece.king = true;
        }

        if( piece.color == 'B' && to.x == 0 ) {
            piece.king = true;
        }

        // Remove captures pieces from the board
        for( let n = 0; n < captures.length; ++n ) {
            this.board[captures[n].x][captures[n].y] = null;
        }
    }

    /**
     * Executes the actual move on the internal board data
     * @param {object} from {x, y}
     * @param {object} to {x, y} 
     * @param {array} captures An array of x/y positions of captures
     */
    this.executeMove = ( from, to, captures ) => {
        let packet = generateWSPacket( { 
            action: 'move',
            game_id: this.game.id,
            moveData: {
                from: { x: from.x, y: from.y }, 
                to: { x: to.x, y: to.y },
                captures: captures
            }
        } );

        ws.send( packet );

        this.cleanBoardDom();

        let piece = this.board[to.x][to.y] = this.board[from.x][from.y];
        this.board[from.x][from.y] = null;

        // Promote to king if a piece is on the furthest line
        if( piece.color == 'W' && to.x == 7 ) {
            piece.king = true;
        }

        if( piece.color == 'B' && to.x == 0 ) {
            piece.king = true;
        }

        // Remove captures pieces from the board
        for( let n = 0; n < captures.length; ++n ) {
            this.board[captures[n].x][captures[n].y] = null;
        }

        if( typeof this.onMoveComplete == 'function' ) {
            this.current_move++;

            // Tell the framework this move is complete
            this.onMoveComplete();
        }

        // Render the updated board
        this.renderPieces();

        // showToast( 'Awaiting a move from the .com' );
    }

    this.stepFirstMove = () => {
        if( this.current_move > 0 )
            this.current_move = 0;

        this.cleanBoardDom();
        this.board = this.generateEmptyBoard();
        let moveData = game.move_data[0];
        this.replayMove( moveData.from, moveData.to, moveData.captures );

        this.renderPieces();
    };

    this.stepNextMove = () => {        
        if( this.game.move_data && this.current_move < this.game.move_data.length )
            this.current_move++;

        this.cleanBoardDom();
        this.board = this.generateEmptyBoard();
        for( let n = 0; n < this.current_move; ++n ) {
            let moveData = game.move_data[n];
            this.replayMove( moveData.from, moveData.to, moveData.captures );
        }

        this.renderPieces();
    };

    this.stepPreviousMove = () => {
        if( this.current_move > 0 )
            this.current_move--;

        this.cleanBoardDom();
        this.board = this.generateEmptyBoard();
        for( let n = 0; n < this.current_move; ++n ) {
            let moveData = game.move_data[n];
            this.replayMove( moveData.from, moveData.to, moveData.captures );
        }

        this.renderPieces();
    };

    this.stepLastMove = () => {
        if( this.current_move != this.game.move_data.length )
            this.current_move = this.game.move_data.length;

        this.cleanBoardDom();
        this.board = this.generateEmptyBoard();

        for( let n = 0; n < this.current_move; ++n ) {
            let moveData = game.move_data[n];
            this.replayMove( moveData.from, moveData.to, moveData.captures );
        }

        this.renderPieces();
    };

    this.renderBoardDOM();

    // The current move the user is viewing
    this.cleanBoardDom();
    this.current_move = this.game.move_data?.length;
    
    if( game.move_data && game.move_data.length ) {
        for( let n = 0; n < game.move_data.length; ++n ) {
            let moveData = game.move_data[n];
            this.replayMove( moveData.from, moveData.to, moveData.captures );
        }
    }
    this.renderPieces();


    document.querySelector( 'div#game_controls button.first' ).onclick = this.stepFirstMove;
    document.querySelector( 'div#game_controls button.next' ).onclick = this.stepNextMove;
    document.querySelector( 'div#game_controls button.prev' ).onclick = this.stepPreviousMove;
    document.querySelector( 'div#game_controls button.last' ).onclick = this.stepLastMove;
}
