const jwt = require( 'jsonwebtoken' )
    // ,WebSocket = require( 'ws' )
    // ,fs = require( 'fs' )
    // ,HttpsServer = require( 'https' ).createServer
    ,sequelize = require( './models/sequelize_initialize' )
    ,{ mapAndExecWSPacket } = require( './wss_router' )
    ,wsManager = require( './objects/ws_manager' );
    // ,{ verifyClient } = require( 'methods' );


const userSockets = wsManager;

function connectSocket( wss ) {
    wss.on( 'connection', ( ws, req ) => {
        // The user's authToken shouldn't be here, but the header is

        var userId = null;

        if( req.user_id ) {
            userId = req.user_id;
        }


        var parts = req.headers.cookie.split( ' ' );
        var token = false;
        for( var n = 0; ( n < parts.length) && (!token); ++n ) {
                if( parts[n].startsWith( 'auth_token=' ) ) {
                        token = parts[n].substr( 11 );
                }
        }

        const userData = jwt.verify( token, process.env.AUTH_SECRET_KEY );
        userId = userData.id;

        // Store the user's socket each time they login on 
        // a from a socket
        userSockets.add( userId, ws );

        // Make sure we can tell when a client has disconnected if they
        // don't explicitly log out.
        ws.isAlive = true;
        ws.on( 'error', console.error );
        ws.on( 'pong', () => {
            // console.log( 'pong ', ws.isAlive );
            ws.isAlive = true;
        } );

        console.log( 'client connected to socket server, id = ', userId );

        // Remove any existing move tokens for games that aren't owned by this user
        // If this doesn't happen, the games sit in the queue and wait. I need to expire
        // the tokens
        const deleteMTSql = `delete mt.*
                            from move_tokens mt
                            join games g ON mt.user_id != g.owner_id
                            where g.status = 'collective'
                            and mt.active = 1
                            and mt.user_id = ${userId}`;
        sequelize.query( deleteMTSql ).then( ( result ) => {} );

        ws.on( 'message', ( message, request ) => {
            let data = JSON.parse( message.toString() );
            console.log( 'wss_server::onmessage, userid: ' + userId + ' data: ', data );

            mapAndExecWSPacket( userId, data );
        } );

        ws.on( 'close', () => {
            if( userSockets.get( userId )?.size === 0 )
                userSockets.delete( userId );
        } );

        // console.log( 'Sending toast' );
        // const toast = { action: 'toast', msg: 'toast is working!' };
        // console.log( JSON.stringify( toast ) );

        // ws.send( JSON.stringify( toast ) );

        // ws.send( `Echo: The server is responding.` );

        const interval = setInterval(() => {
            wss.clients.forEach( ( ws ) => {
                if( ! ws.isAlive ) {
                    console.log( 'Terminating dead client userId:', ws.userId );
                    return ws.terminate();
                }

                // console.log( 'ping ', ws.isAlive );

                ws.isAlive = false;
                ws.ping();
            } );
        }, 10000);

        ws.on( 'close', () => {
            console.log( 'ws.on( close ) called, ws.userId = ', ws.userId );
            clearInterval( interval );
        } );
    } );
}

module.exports = {
    connectSocket: connectSocket,
    userSockets: userSockets
};