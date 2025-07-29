const Games = require( '../models/Games' );
const wsManager = require( '../objects/ws_manager' );
const { addVictory, addDefeat } = require( '../objects/statsInterface' );

// Returns either O, X, or false
function determineWinner( moveData ) {
    var result = false;

    // Build the state of the board
    var boardState = Array(9);
    for( var n = 0; n < moveData.length; ++n ) {
        boardState[moveData[n].pos] = 
            (moveData[n].piece)? moveData[n].piece: '' ;
    }

    /**
     * 0, 1, 2,
     * 3, 4, 5,
     * 6, 7, 8,
     */

    // Check the verticals
    for( var n = 0; n < 3; n++ ) {
        if( boardState[n] && 
            boardState[n] == boardState[n + 3] &&
            boardState[n] == boardState[n + 6] ) {

                // If we found a win, return that piece
                return boardState[n];
        }
    }

    // Check the horizontals
    for( var n = 0; n < 9; n +=3 ) {
        if( boardState[n] &&
            boardState[n] == boardState[n + 1] &&
            boardState[n] == boardState[n + 2] ) {

                // If we found a win, return that piece
                return boardState[n];
        }
    }

    // Check the diagonals
    if( boardState[0] &&
        boardState[0] == boardState[4] &&
        boardState[0] == boardState[8] ) {

            return boardState[n];
        }
    
    if( boardState[2] && 
        boardState[2] == boardState[4] &&
        boardState[2] == boardState[6] ) {

            return boardState[2];
        }

    return result;
}

module.exports = {
    'move': async ( user_id, game, move ) => {
        const updateData = [];

        // Put the moves onto a "board" to process for wins
        const moveData = ( game.dataValues.move_data )?
            game.dataValues.move_data: [];
        moveData.push( move );
        updateData.move_data = moveData;

        // Check to see if there is a winner or not
        var winCheck = determineWinner( moveData );
        if( winCheck ) {
            updateData.status = 'finished';

            if( winCheck == 'X' ) {
                addVictory( game.dataValues.owner_id );
                updateData.result = 'individual';
            }
            else if( winCheck == 'O' ) {
                updateData.result = 'collective';
                addDefeat( game.dataValues.owner_id );
            }

        } else {
            // Otherwise, if the board is full, it's a tie, mark it as such
            if( updateData.move_data.length >= 9 ) {
                updateData.status = 'finished';
                updateData.result = 'tie';
            } else {
                // If the current user is the owner and it's their turn
                if( game.dataValues.status == 'individual' && user_id == game.owner_id ) {
                    updateData.status = 'collective';
                } else if( game.dataValues.status == 'collective' ) {
                    updateData.status = 'individual';
                }
            }
        }

        const result = await Games.update(
            updateData,
            { where: {id: game.id} }
        );
    }
}
