const getUserDataFromJWT = require( '../middleware/auth' );
const emailVerified = require( '../middleware/emailVerified' );
const { sendContactMeEmail } = require( '../methods' );

module.exports = function( app ) {
    
    app.get( '/', getUserDataFromJWT, (req, res) => {
        res.render( 'main_view', {
            main_content_ejs: 'home.ejs',
            user_id: req.user_id || false,
            env: process.env.ENV || 'production',
        } );
    });

    app.get( '/dashboard', [getUserDataFromJWT, emailVerified], ( req, res ) => {
        res.render( 'main_view', {
            main_content_ejs: 'dashboard.ejs',
            user_id: req.user_id || false,
            env: process.env.ENV || 'production',
        } );
    });

    app.get( '/about', getUserDataFromJWT, ( req, res ) => {
        res.render( 'main_view', {
            main_content_ejs: 'about.ejs',
            user_id: req.user_id || false,
            env: process.env.ENV || 'production',
        } );
    } );

    app.get( '/contact', getUserDataFromJWT, ( req, res ) => {
        res.render( 'main_view', {
            main_content_ejs: 'contact.ejs',
            user_id: req.user_id || false,
            env: process.env.ENV || 'production',
            errors: {},
        } );
    } );

    app.post( '/contact', getUserDataFromJWT, ( req, res ) => {
        const { from_name, from_email, message } = req.body;
        const errors = {};

        if( ! from_email || ! from_email.length ) {
            errors.email = 'You must enter an email address';
        }

        if( ! message || ! message.length ) {
            errors.message = 'You must enter a message';
        }

        if( ! errors.email && ! errors.message ) {
            sendContactMeEmail( from_name, from_email, message );
            res.redirect( '/contact_sent' );
            res.end();
        } else {
            res.render( 'main_view', {
                main_content_ejs: 'contact.ejs',
                user_id: req.user_id || false,
                errors: errors,
            } );
            res.end();
        }
    } );

    app.get( '/contact_sent', ( req, res ) => {
        res.render( 'main_view', {
            main_content_ejs: 'contact_result.ejs',
            user_id: req.user_id || false,
            env: process.env.ENV || 'production',
            errors: [],
        } );
        res.end();
    } );

    app.get( '/history', [getUserDataFromJWT, emailVerified], ( req, res ) => {
        res.render( 'main_view', {
            main_content_ejs: 'history.ejs',
            user_id: req.user_id || false,
            env: process.env.ENV || 'production',
        } );
    } );

    app.get( '/signup_success', ( req, res ) => {
        res.render( 'main_view', {
            main_content_ejs: 'signup_success.ejs',
            user_id: req.user_id || false,
            env: process.env.ENV || 'production',
        } );
    } );

    app.get( '/signup_error', ( req, res ) => {
        res.render( 'main_view', {
            main_content_ejs: 'signup_error.ejs',
            user_id: req.user_id || false,
            env: process.env.ENV || 'production',
        } );
    } );
};
