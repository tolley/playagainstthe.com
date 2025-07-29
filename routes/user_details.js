const getUserDataFromJWT = require( '../middleware/auth' );
const UserDetails = require( '../models/UserDetails' );

const sendResults = ( res, data ) => {
    res.setHeader('Content-Type', 'application/json');
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.set('Pragma', 'no-cache'); // for older browsers
    res.set('Expires', '0'); // for older browsers
    res.send( JSON.stringify( data ) );
    res.end();
};

module.exports = function( app ) {
    app.get( '/userdetails', getUserDataFromJWT, function( req, res ) {
        // If the user isn't logged in, send junk back
        if( ! req?.user_id ) {
            res.end();
        } else {
            UserDetails.findOne( { where: {
                user_id: req.user_id
            } } )
            .then( ( details ) => {
                sendResults( res, details );
            } );
        }
    } );
};
