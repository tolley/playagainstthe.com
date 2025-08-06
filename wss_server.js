const jwt = require( 'jsonwebtoken' )
    ,WebSocket = require( 'ws' )
    ,fs = require( 'fs' )
    ,HttpsServer = require( 'https' ).createServer
    ,sequelize = require( './models/sequelize_initialize' )
    ,{ mapAndExecWSPacket } = require( './wss_router' )
    ,wsManager = require( './objects/ws_manager' );


const userSockets = wsManager;

// let wssOpts = {};

if( process.env.ENV == 'production' ) {
 
    var server = HttpsServer( {
        cert: fs.readFileSync( '/etc/letsencrypt/live/playagainstthe.com/fullchain.pem' ),
        key: fs.readFileSync( '/etc/letsencrypt/live/playagainstthe.com/privkey.pem' )
    } );
} else {
    var server = null;
}

// A set to map user sockets to their user data
// const userSockets = new Map();

// Create our websocket server configuration
const wssOpts = {
    server: server,
    port: process.env.WSS_PORT,
    verifyClient: ( info, next ) => {
        // Get the cookies from the user, there should be
        // an auth_token jwt cookie
        const cookies = info.req.headers.cookie;
        if( ! cookies || cookies.length == 0 ) {
            next( false );
            return false;
        }
        const individualCookies = cookies.split( ';' );
        var auth_token = false;

        for( cookieStr of individualCookies ) {
            const cookieParts = cookieStr.split( '=' );
            if( cookieParts.length < 2 )
                continue;

            const name = cookieParts[0];
            const value = cookieParts[1];

            if( name.trimStart() == 'auth_token' ) {
                auth_token = value;
            }
        }

        // If we don't have a valid auth token, redirect to
        // an authorized page.
        if( ! auth_token ) {
            next( false );
            return false;
        }

        // If we have an auth token, verify it
        const userData = jwt.verify( auth_token, process.env.AUTH_SECRET_KEY );

        if( userData && userData.id ) {
            info.req.user_id = userData.id
            next( info.req );
            return true;
        }

        next( true );
        return true;
    }
};

const wss = new WebSocket.Server( wssOpts );

wss.on( 'connection', ( ws, req ) => {    
    const userId = req.user_id;

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

module.exports = {
    wss: wss, 
    userSockets: userSockets
};