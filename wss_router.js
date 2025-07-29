const Games = require( './models/Games' );
const { hasActiveMoveToken, deactivateMoveToken, createMoveToken } = require( './methods' );
const { countCollectiveMove } = require( './objects/statsInterface' );

const wsManager = require( './objects/ws_manager' );

// Load the user level wsQueueActions for joining/leaving collective queues
const { wsQueueActions } = require( './wss_queue_manager' );

// Load our game specific actions so we can map them to methods
// const guinieaPigActionMap = require( './game_action_maps/guiniea_pig' );
const tictactoeActionMap = require( './game_action_maps/tictactoe' );
const checkersActionMap = require( './game_action_maps/checkers' );


// Map the action maps to the game types, I'm hardcoding by id
// cause I don't want to query the DB for the mapping
// where game.game_type == game_types.id.
const gameTypeMap = {
    // 3: guinieaPigActionMap,
    1: tictactoeActionMap,
    2: checkersActionMap,
};

function mapAndExecWSPacket( userId, wsData ) {
    if( wsData.game_id ) {
        // Get the game info
        Games.findOne( { where: {
            id: wsData.game_id
        } } )
        .then( async ( game ) => {
            if( gameTypeMap[game.game_type] ) {
                let typeMappings = gameTypeMap[game.game_type];

                if( typeMappings[wsData.action] &&
                    typeof typeMappings[wsData.action] === 'function' ) {

                        // If the user has a move token for this game
                        const canAct = await hasActiveMoveToken( userId, wsData.game_id );
                        if( canAct ) {
                            const moveData = wsData.moveData;

                            // Execute the action from the socket
                            await typeMappings[wsData.action]( userId, game, moveData );

                            // Deactivate the move token.
                            deactivateMoveToken( userId, wsData.game_id );

                            if( game.owner_id != userId ) {
                                countCollectiveMove( userId );
                            }

                            // Reload our game data after the move
                            game = await Games.findOne( {
                                where: {
                                    id: wsData.game_id
                                }
                            } );

                            // If a member of the collective made a move in a game, 
                            // create a move token for the individual game owner and
                            // set the game to individual
                            if( game.status == 'individual' ) {
                                createMoveToken( game.owner_id, game.id );
                            }

                            // Otherwise, if the user is online, send them the updated game data
                            let ownerSock = wsManager.get( game.owner_id );
                            if( ownerSock && ownerSock.send ) {
                                ownerSock.send( JSON.stringify( {
                                    action: 'update',
                                    game: game
                                } ) );

                                if( userId != game.owner_id ) {
                                    ownerSock.send( JSON.stringify( {
                                        action: 'toast',
                                        msg: 'It\'s your turn: <a href="/dashboard#/game/' + game.id + '">Game ' + game.id + '</a>'
                                    } ) );
                                }
                            }
                            // The cron will generate move tokens for members of
                            // the collective once they've been given a move
                        } else {
                            // Not sure how to let the user know, or if I even should
                            console.log( 'User cannot move in this game' );
                        }
                } else {
                    console.log( 'no action found for ', wsData );
                    throw 'No action found for ' + JSON.stringify( wsData );
                }
            } else {
                console.log( 'no type mapping found for ', game.game_type );
                throw 'No type mapping four for ' + game.game_type;
            }
        } );
    } else {
        if( wsData.action && wsQueueActions[wsData.action] ) {
            wsQueueActions[wsData.action]( userId, wsData.queue_id );
        } else {
            console.log( 'No action found in wss_router for action = ', wsData );
        }
    }
}

module.exports = {
    mapAndExecWSPacket
};