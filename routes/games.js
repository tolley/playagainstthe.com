const getUserDataFromJWT = require( '../middleware/auth' );
const GameTypes = require( '../models/GameTypes' );
const MoveTokens = require( '../models/MoveTokens' );
const Games = require( '../models/Games' );

const sendResults = ( res, games ) => {
    res.setHeader('Content-Type', 'application/json');
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.set('Pragma', 'no-cache'); // for older browsers
    res.set('Expires', '0'); // for older browsers
    res.send( JSON.stringify( games ) );
    res.end();
};

// The CRUD API for game_types
module.exports = function( app ) {
    // Get game details
    app.get( '/game/:game_id?', getUserDataFromJWT, ( req, res ) => {
        // If the game id is set in the url, load that games data
        if( req.params && req.params.game_id ) {
            // Get the single requested game and return it
            // in json format to the browser.
            if( isNaN( req.params.game_id ) ) {
                res.send( 'Invalid URL parammeter. Must be a number' );
                res.end();
            }

            var where = {
                id: req.params.game_id
            }

            Games.findOne( {
                where: {
                    id: req.params.game_id
                }
            } ).then( ( game ) => sendResults( res, game ) );
        } else {
            // If no one is logged in, return nothing
            if( ! req.user_id ) {
                res.send( [] );
                res.end();
            } else {
                const whereClause = {
                    owner_id: req.user_id
                }

                // The status to the where clause if it was sent in the query string
                if( req.query.status && req.query.status.length > 0 ) {
                    whereClause.status = req.query.status;
                }

                // The query limit
                var limit = 20;
                if( req.query.limit && parseInt( req.query.limit ) != NaN ) {
                    limit = parseInt( req.query.limit );
                }

                // Otherwise, get a list of all games for the player
                Games.findAll( {
                    where: whereClause,
                    limit: limit
                } ).then( ( games ) => sendResults( res, games ) );
            }
    
        }
    } );

    // Create a new game
    app.put( '/game', getUserDataFromJWT, ( req, res ) => {
        // Need to add validation
        const newGameData = {
            owner_id: req.user_id,
            game_type: req.body.game_type
        };

        Games.create( newGameData ).then( ( newGame ) => {
            // Create the move_token to get the game started
            const moveTokenData = {
                user_id: req.user_id,
                game_id: newGame.dataValues.id
            };

            MoveTokens.create( moveTokenData ).then( ( token ) => {
                var where = {
                    id: newGame.id
                }

                Games.findOne( {
                    where: where
                } ).then( ( game ) => sendResults( res, game ) );
            }  );
        } );
    } );

};
