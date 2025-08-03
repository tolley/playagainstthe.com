const jwt = require( 'jsonwebtoken' );

// This middleware attempts to decode the token if one is found.
// This middleware will not stop page execution, it will only set
// user data in the req object, the request can redirect itself
// if the req.id isn't set.
function getUserDataFromJWT( req, res, next ) {
    const token = req.cookies.auth_token;
    // if( ! token ) {
    //     return res.status( 401 ).json( { error: 'Access Denied!' } );
    // }

    try {
        // This does not enforce the login, only add the userId to the req object
        const decoded = jwt.verify( token, process.env.AUTH_SECRET_KEY );
        req.user_id = decoded.id;
    } catch( error ) {
    };

    next();
}

module.exports = getUserDataFromJWT;