const Games = require( '../models/Games' );
const { addVictory, addDefeat } = require( '../objects/statsInterface' );

module.exports = {
    'move': async ( user_id, game, move ) => {
        const updateData = [];

        // Replay the game from a new board
        const board = getFreshBoard();
        if( game.dataValues.move_data && 
            game.dataValues.move_data.length > 0 ) {

            for( let n = 0; n < game.dataValues.move_data.length; ++n ) {
                let currMove = game.dataValues.move_data[n];

                if( board[currMove.from.x][currMove.from.y] && 
                    ! board[currMove.to.x][currMove.to.y] ) {
                        replayMove( board, currMove.from, currMove.to, currMove.captures );

                        // let piece = board[currMove.from.x][currMove.from.y];
                        // board[currMove.to.x][currMove.to.y] = board[currMove.from.x][currMove.from.y];
                        // board[currMove.from.x][currMove.from.y] = null;
                }

                if( currMove.captures && currMove.captures.length > 0 ) {
                    for( let m = 0; m < currMove.captures.length; ++m ) {
                        let capturedPos = currMove.captures[m];
                        board[capturedPos.x][capturedPos.y] = null;
                    }
                }
            }
        }

        // B is the individual
        // W is the collective

        for( let n = 0; n < move.captures.length; ++n ) {
            board[move.captures[n].x][move.captures[n].y] = null;
        }
        
        // Put the move data into the DB model to save
        const moveData = ( game.dataValues.move_data )?
            game.dataValues.move_data: [];
        moveData.push( move );
        updateData.move_data = moveData;

        // If the current user is the owner and it's their turn
        if( game.dataValues.status == 'individual' && user_id == game.owner_id ) {
            updateData.status = 'collective';
        } else if( game.dataValues.status == 'collective' ) {
            updateData.status = 'individual';
        }

        // Check the state of the board and determine if the game has ended or not
        const remainingStones = getListOfStones( board );
        if( remainingStones.B.length == 0 && remainingStones.W.length > 0 ) {
            // No black stones left, the collective wins
            updateData.status = 'finished';
            updateData.result = 'The .com Won!'
            addDefeat( game.owner_id );
        } else {
            // Can B keep playing (are there available moves)
            let bBAvailableMove = false;
            for( var n = 0; ( n < remainingStones.B.length && ! bBAvailableMove ); ++n ) {
                bBAvailableMove = hasAvailableMove( remainingStones.B[n], board );
            }

            if( ! bBAvailableMove ) {
                updateData.status = 'finished';
                updateData.result = 'The .com Won!'
                addDefeat( game.owner_id );
            }
        }

        if( remainingStones.W.length == 0 && remainingStones.B.length > 0 ) {
            // No white stones left, the individual wines
            updateData.status = 'finished';
            updateData.result = 'You won!!! 77';

            console.log( 'I think it just happened?' );
            console.log( 'remainingStones = ', remainingStones );

            addVictory( game.owner_id );
        } else {
            // Can W keep playing (are there available moves)
            let bWAvailableMove = false;
            for( var n = 0; ( n < remainingStones.W.length && ! bWAvailableMove ); ++n ) {
                bWAvailableMove = hasAvailableMove( remainingStones.W[n], board );
            }

            if( ! bWAvailableMove ) {
                updateData.status = 'finished';
                updateData.result = 'You won!!! 88';

                console.log( 'I think it just happened?' );
                console.log( 'Stone: ', remainingStones.W[n] );
                console.log( 'board = ', board );
                

                addVictory( game.owner_id );
            }
        }

        // Check each side to see if there are any more possible moves.  If not, game
        // ends in a tie

        const result = await Games.update(
            updateData,
            { where: {id: game.id} }
        );
    }
};

const hasAvailableMove = ( piece, board ) => {
    // // Make sure the piece is on the board
    // if( board[piece.x] == null || board[piece.x][piece.y] == null ) {
    //     return false;
    // }

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

    for( var n = 0; n < relevantSlopes.length; ++n ) {
        let slope = relevantSlopes[n];
        
        const sloped = {
            x: piece.x + slope.x,
            y: piece.y + slope.y
        };

        // If the space is empty, it's a potential move

        // Need to check the stone's position + slope
        if( ! board[sloped.x] || ! board[sloped.x][sloped.y] ) {
            return true;
        }

        // If the space contains a piece of the opposing color, 
        // see if the next space is empty (jump)
        if( board[sloped.x][sloped.y].color != piece.color ) {

            // This is wrong! Gonna go spend time with my son now
            // bbl
            let extdSlopeX = sloped.x + slope.x;
            let extdSlopeY = sloped.y + slope.y;

            if( extdSlopeX >= 0 && extdSlopeX < 8 && extdSlopeY >= 0 && extdSlopeY < 8 &&
                board[extdSlopeX] && ! board[extdSlopeX][extdSlopeY] ) {
                    return true;
            }

            // if( extdSlopeX >= 0 && extdSlopeX < 8 && extdSlopeY >= 0 && extdSlopeY < 8 &&
            //     // board[slopeX] && board[slopeX][slopeY] && 
            //     board[sloped.x][sloped.y].color != piece.color && 
            //     ( ! board[extdSlopeX] || ! board[extdSlopeX][extdSlopeY] ) ) {
            //         return true;
            //     }
        }
    }

    // If we haven't found a valid move here, return false
    return false;
}


/**
 * Returns a fresh checker board ready to play
 * 
 * @returns Array An 8x8 array, a checkerboard setup
 *          for a game
 */
const getFreshBoard = () => {
    const board = [];
    for( var n = 0; n < 8; ++n ) {
        board.push( [ null, null, null, null,
                        null, null, null, null ] );
    }

    // Put the starting pieces onto the board
    board[0][0] = { x: 0, y: 0, king: false, color: 'W' };
    board[0][2] = { x: 0, y: 2, king: false, color: 'W' };
    board[0][4] = { x: 0, y: 4, king: false, color: 'W' };
    board[0][6] = { x: 0, y: 6, king: false, color: 'W' };
    
    board[1][1] = { x: 1, y: 1, king: false, color: 'W' };
    board[1][3] = { x: 1, y: 3, king: false, color: 'W' };
    board[1][5] = { x: 1, y: 5, king: false, color: 'W' };
    board[1][7] = { x: 1, y: 7, king: false, color: 'W' };

    board[2][0] = { x: 2, y: 0, king: false, color: 'W' };
    board[2][2] = { x: 2, y: 2, king: false, color: 'W' };
    board[2][4] = { x: 2, y: 4, king: false, color: 'W' };
    board[2][6] = { x: 2, y: 6, king: false, color: 'W' };

    board[5][1] = { x: 5, y: 1, king: false, color: 'B' };
    board[5][3] = { x: 5, y: 3, king: false, color: 'B' };
    board[5][5] = { x: 5, y: 5, king: false, color: 'B' };
    board[5][7] = { x: 5, y: 7, king: false, color: 'B' };
    
    board[6][0] = { x: 6, y: 0, king: false, color: 'B' };
    board[6][2] = { x: 6, y: 2, king: false, color: 'B' };
    board[6][4] = { x: 6, y: 4, king: false, color: 'B' };
    board[6][6] = { x: 6, y: 6, king: false, color: 'B' };

    board[7][1] = { x: 7, y: 1, king: false, color: 'B' };
    board[7][3] = { x: 7, y: 3, king: false, color: 'B' };
    board[7][5] = { x: 7, y: 5, king: false, color: 'B' };
    board[7][7] = { x: 7, y: 7, king: false, color: 'B' };

    return board;
};

/**
 * Returns a list of all stones on the board
 * 
 * @param 2 dimensional array for the checker board
 */
function getListOfStones( board ) {
    var stones = {
        W: [],
        B: []
    }

    for( let x = 0; x < 8; ++x ) {
        for( let y = 0; y < 8; ++y ) {
            if( board[x][y] ) {
                stones[board[x][y].color].push( board[x][y] );
            }
        }
    }

    return stones;
}

const replayMove = ( board, from, to, captures ) => {
    let piece = board[from.x][from.y];
    
    // Need to figure out why the piece is null, that shouldn't happen
    if( piece == null )
        return;

    piece.x = to.x;
    piece.y = to.y;

    // Promote to king if a piece is on the furthest line
    if( piece.color == 'W' && to.x == 7 ) {
        piece.king = true;
    }

    if( piece.color == 'B' && to.x == 0 ) {
        piece.king = true;
    }

    board[to.x][to.y] = piece;
    board[from.x][from.y] = null;

    // Remove captured pieces from the board
    for( let n = 0; n < captures.length; ++n ) {
        board[captures[n].x][captures[n].y] = null;
    }

    return board;
}

