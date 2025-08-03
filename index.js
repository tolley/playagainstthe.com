require( 'dotenv' ).config();
const express = require('express')
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

// Load our websocker server
const { wss } = require( './wss_server.js' );

// Load the cron route.  This needs to be restricted to be
// only runnable from the crontab
require( './routes/cron.js' )( app, wss );

// Start the server
// '0.0.0.0'
app.listen( process.env.HTTP_PORT, '0.0.0.0' , () => {
    console.log( 'Server is running on http://0.0.0.0:' + process.env.HTTP_PORT );
});
