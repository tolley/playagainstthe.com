require( 'dotenv' ).config();
const express = require('express')
    ,https = require( 'https' )
    ,fs = require( 'fs' )
    ,{ verifyClient } = require( 'methods' )
    ,cookieParser = require( 'cookie-parser' )
    ,bodyParser = require( 'body-parser' );


// Create our express server and set up the middlewares
const app = express();
app.use( cookieParser() );
app.use( express.static( 'public' ) );
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded( {
    extended: true
} ) );
app.use( express.json() );
app.set( 'view engine', 'ejs' );


// Include routes from other files
require( './routes/user.js' )( app );
require( './routes/main.js' )( app );
require( './routes/games.js' )( app );
require( './routes/gametypes.js' )( app );
require( './routes/collective_queue' )( app );
require( './routes/user_details' )( app );

// Start the server
// '0.0.0.0'
// app.listen( process.env.HTTP_PORT, '0.0.0.0' , () => {
//     console.log( 'Server is running on http://0.0.0.0:' + process.env.HTTP_PORT );
// });

const options = {
    key: fs.readFileSync( '/etc/letsencrypt/live/playagainstthe.com/fullchain.pem' ),
    cert: fs.readFileSync( '/etc/letsencrypt/live/playagainstthe.com/privkey.pem' )
};

// Start our https server
var server = https.createServer( options, app )
    .listen( process.env.WSS_PORT, function( req, res ) {
        console.log( "Server started at port " + process.env.WSS_PORT );
    }
);

// Create our websocket server configuration
const wssOpts = {
    server: server,
    // port: process.env.WSS_PORT,
    verifyClient: verifyClient
};

// Load our websocker server and it's routes
const wss = new WebSocket.Server( wssOpts );
const { connectSocket } = require( './wss_server.js' );
connectSocketSocket( wss, req );

// Load the cron route.  This needs to be restricted to be
// only runnable from the crontab
require( './routes/cron.js' )( app, wss );
