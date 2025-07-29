require("dotenv").config();
const jwt = require( "jsonwebtoken" );
const cors = require( "cors" );

const AUTH_SECRET_KEY = process.env.AUTH_SECRET_KEY || '.envdidnotwork';

function authenticateToken( req, res, next ) {
    const token = req.cookies.token || req.headers["authorization"]?.split(" ")[1];

    if( !token )
        return res.sendStatus(403);

    jwt.verify( token, AUTH_SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

function generateToken( user ) {
    return jwt.sign({ id: user.id, username: user.username },
        AUTH_SECRET_KEY,
        {
            expiresIn: "1h",
        }
    );
}

module.exports = authenticateToken;