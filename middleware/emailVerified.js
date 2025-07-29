const Users = require( '../models/Users' );

/**
 * Verifies that the currently logged in user has verified
 * their email address
 */
async function hasVerifiedEmail( req, res, next ) {
    if( req.user_id ) {
        const user = await Users.findOne( {
            where: {
                verified_email: 1,
                id: req.user_id
            }
        } );

        if( user )
            next();
        else {
            console.log( 'Unverfified email found in emailVerified middleware' );
            res.redirect( '/verifyemail' );
            res.end();
        }
    } else {
        console.log( 'No user found in hasVerifiedEmail' );
        res.redirect( '/login' );
        res.end();
        // Don't call next
    }
}

module.exports = hasVerifiedEmail;