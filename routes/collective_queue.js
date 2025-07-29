const collectiveQueue = require( '../models/CollectiveQueue' );

// The CRUD API for game_types
module.exports = function( app ) {

    app.get( '/collective_queue', async ( req, res ) => {
        collectiveQueue.findAll()
            .then( ( data ) => {
                res.setHeader( 'Content-Type', 'application/json' );
                res.end( JSON.stringify( data ) );
            }
        );
    } );
};