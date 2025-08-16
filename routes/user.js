const Users = require( '../models/Users' );
const UserDetails = require( '../models/UserDetails' );
const EmailVerifyToken = require( '../models/EmailVerifyToken' );
const getUserDataFromJWT = require( '../middleware/auth' );
const { createEmailVerificationToken, 
		sendEmailVerificationEmail
	 } = require( '../methods' );

const bcrypt = require( 'bcrypt' );
const jwt = require( 'jsonwebtoken' );

module.exports = function( app ) {

	// Render the signup form
	app.get( '/signup', function( req, res ) {
		res.render( 'main_view', {
			main_content_ejs: 'signup.ejs',
            user_id: req.user_id | false,
			env: process.env.ENV || 'production',
		} );
	} );

	// Process the signup request
    app.post( '/signup', async function( req, res ) {
        // Make sure the user entered all the required fields
		if( ! req.body || 
            ! req.body.username || req.body.username.length == 0 ||
			! req.body.email || req.body.email.length == 0 ||
			! req.body.password || req.body.password.length == 0 ||
			! req.body.repeat_password || req.body.repeat_password.length == 0 ||
			req.body.password != req.body.repeat_password ) {
				res.send( { 'status': 'failure', 'message': 'Invalid data for user insert' } );
				res.end();
		} else {
			const passHash = 
				await bcrypt.hash( req.body.password + process.env.USER_PASSWORD_POSTPEND, 10 );

			var userData = {
                username: req.body.username,
				email: req.body.email,
				password: passHash,
				source: 'local'
			};

			try {
				const newUser = await Users.create( userData );

				createEmailVerificationToken( newUser.id ).then( ( result ) => {
					if( result && result.dataValues )
						sendEmailVerificationEmail( newUser, result.dataValues.token );
				} );
			} catch( e ) {
				res.redirect( '/signup_error' );
				res.end();
			}

			res.redirect( '/signup_success' );
			res.end();
		}
    } );

	// Render the login form
	app.get( '/login', function( req, res ) {
		// res.render( 'login' );
		res.render( 'main_view', {
			main_content_ejs: 'login.ejs',
            user_id: req.user_id | false,
			env: process.env.ENV || 'production',
		} );
	} );

	// Process the login request
	app.post( '/login', async function( req, res ) {
		const { username, password } = req.body;

		// See if the user exists in the DB at all
		const user = await Users.findOne( { where: { username: username } } );
		if( ! user ) {
			return res.status( 401 ).json( { error: 'Authentification failed, user not found' } );
		}

		// Check the password
		const passwordMatch = await bcrypt.compare( password + process.env.USER_PASSWORD_POSTPEND, user.password );
		if( ! passwordMatch ) {
			return res.status( 401 ).json( { error: 'Authentification failed, password failed' } );
		}

		// If we're here, then the user has successfully been validated, create the
		// jwt and send it to the user
		const jwtOpts = {
			expiresIn: '24h'
		};

		const token = jwt.sign( { id: user.id }, process.env.AUTH_SECRET_KEY, jwtOpts );

		const cookieOpts = {
			httpOnly: true,
			secure: true,
			sameSite: 'Strict',
			maxAge: 60 * 60 * 24 * 30,
			path: '/',
		};

		res.cookie( 'auth_token', token, cookieOpts );
		res.status( 200 ).json( { status: 'success' } );
		res.end();
	} );

	app.get( '/logout', ( req, res ) => {
		res.clearCookie( 'auth_token' );
		res.end();
	} );

	app.get( '/verifyemail/:token', getUserDataFromJWT, ( req, res ) => {
		const token = req.params.token;

		EmailVerifyToken.findOne( {
				where: {
					token: token
				}
		} ).then( ( token ) => {
			if( token && token.user_id ) {
				Users.update({
					verified_email: 1
				}, {
					where: {id: token.user_id}
				}).then( () => {
					UserDetails.create( { 
						user_id: token.user_id,
						sound: 1
					 } );
					
					res.redirect( '/verified' );
					res.end();
				} );
			}
		} );
	} );

	app.get( '/welcome', ( req, res ) => {
		res.render( 'main_view', {
			main_content_ejs: 'welcome.ejs',
            user_id: req.user_id | false,
			env: process.env.ENV || 'production',
		} );
	} );

	app.get( '/verifyemail', getUserDataFromJWT, ( req, res ) => {
		res.render( 'main_view', {
			main_content_ejs: 'verifyemail.ejs',
            user_id: req.user_id | false,
			env: process.env.ENV || 'production',
		} );
	} );

	app.get( '/verified', ( req, res ) => {
		res.render( 'main_view', {
			main_content_ejs: 'verified.ejs',
            user_id: req.user_id | false,
			env: process.env.ENV || 'production',
		} );
	} );

	app.get( '/resendverificationemail', getUserDataFromJWT, async ( req, res ) => {
		if( ! req.user_id ) {
			res.redirect( '/login' );
			res.end();
			return;
		}
	
		const user = await Users.findOne( {
			where: { id: req.user_id }
		} );

		// Don't send the email if the user has already verified
		if( user.verified_email ) {
			res.redirect( '/login' );
			res.end();
			return;
		}

		const token = await EmailVerifyToken.findOne( {
			where: { user_id: user.id }
		} );

		sendEmailVerificationEmail( user, token.token );

		res.redirect( '/verificationemailsent' );
		res.end();
	} );

	app.get( '/verificationemailsent', ( req, res ) => {
		res.render( 'main_view', {
			main_content_ejs: 'verificationemailsent.ejs',
            user_id: req.user_id | false,
			env: process.env.ENV || 'production',
		} );
	} );
}