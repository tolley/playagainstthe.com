const GameTypes = require( '../models/GameTypes' );

// The CRUD API for game_types
module.exports = function( app ) {

    app.get( '/game_types', async ( req, res ) => {
        const gametypes = await GameTypes.findAll();
        res.setHeader( 'Content-Type', 'application/json' );
        res.end( JSON.stringify( gametypes ) );
    } );
};