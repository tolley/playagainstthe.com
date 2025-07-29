/**
 * This file contains the definition for a cron that will run
 * and create move_tokens for user's connected via websocket (wss)
 * and then let them know.
 */

const wsManager = require( '../objects/ws_manager' );
const { wsQueues } = require( '../wss_queue_manager' );
const MoveTokens = require( '../models/MoveTokens' );
const CollectiveQueue = require( '../models/CollectiveQueue' );
const GameTypes = require( '../models/GameTypes' );
const sequelize = require( '../models/sequelize_initialize' );

var AllGameTypes;
GameTypes.findAll( { raw: true } ).then( ( result ) => {
    AllGameTypes = result;
} );

var collectiveQueueList;
CollectiveQueue.findAll({raw: true}).then( ( result ) => {
    collectiveQueueList = result;
} );

module.exports = function( app ) {
    app.get( '/test', ( req, res ) => {
        const allSockets = wsManager.getAll();

        for( var n = 0; n < allSockets.length; ++n ) {
            allSockets[n].send( {test: 'testing'} );
        }

        console.log( 'wsQueues =', wsQueues );
        res.end();
    } );

    app.get( '/cron', async ( req, res ) => {
        res.write( 'Connected Sockets:\n' );
        const allSockets = wsManager.getAll();
        if( Object.keys( allSockets ).length == 0 ) {
            res.write( 'No Sockets connected\n' );
        } else {
            for( let userId in allSockets ) {
                res.write( 'User Id: ' + userId + ', isAlive = ' + allSockets[userId].isAlive + '\n');
            }
            res.write( '\n' );
        }

        // For each queue (from the DB)
        for( const collque of collectiveQueueList ) {
            if( wsQueues[collque.id] && wsQueues[collque.id].length > 0 ) {
                res.write( 'Looking for a user in queue ' + collque.name  + '\n' );

                // For each user in the queue
                for( var n = 0; n < wsQueues[collque.id].length; ++n ) {
                    let queuedUserId = wsQueues[collque.id][n];
                    let userSock = wsManager.get( queuedUserId );

                    if( userSock.isAlive !== true ) {
                        res.write( 'Found unAlive socket, user_id = ' + queuedUserId + ' continuing;\n' );
                        continue;
                    }


                    const existingTokenCount = await MoveTokens.count( {
                        where: {
                            user_id: queuedUserId,
                            active: 1
                        } }
                    );

                    // If the user already has an active token, continue 
                    if( existingTokenCount > 0 ) {
                        res.write( 'Found active_move_token for user ' + queuedUserId + ', continuing;\n' );
                        continue;
                    }

                    const querySql = `select g.*
                        from games g
                        where g.owner_id != ${queuedUserId}
                        and g.game_type = ${collque.game_type}
                        and g.status = 'collective'
                        and not exists (
                            select mt.id
                            from move_tokens mt
                            where mt.user_id = ${queuedUserId}
                            and mt.game_id = g.id
                            and active = 1
                        ) limit 1`;

                    res.write( 'Searching for game for User ' + queuedUserId + '\n');

                    var [result] = await sequelize.query( querySql );

                    if( result && result.length == 1) {
                        var gameForMove = result[0];

                        var tokenResp = await MoveTokens.create( {
                            game_id: gameForMove.id,
                            user_id: queuedUserId
                        } );

                        res.write( 'Created move token for game: ' + JSON.stringify( tokenResp ) + '\n' );

                        // Let the user know they can make a move in the game.
                        const moveNotification = {
                            action: 'play',
                            game_id: gameForMove.id
                        };

                        let userSock = wsManager.get( queuedUserId );
                        if( userSock ) {
                            // Sending notification of the available move
                            console.log( 'Sending socket data to user ', queuedUserId );
                            userSock.send( JSON.stringify( moveNotification ) );
                        } else {
                            console.log( 'No socket found for user ', queuedUserId );
                        }
                    } else {
                        console.log( 'Unable to find a move in type ' + collque.game_type + ' for user ' + queuedUserId );
                        continue;
                    }
                }
            }
        }

        res.end();
    } );
}