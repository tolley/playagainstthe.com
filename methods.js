/** A collection of useful methods */
// const Games = require( './models/Games' );
const MoveTokens = require( './models/MoveTokens' );
const { v4 } = require( 'uuid' );
const nodemailer = require( 'nodemailer' );
const EmailVerifyToken = require( './models/EmailVerifyToken' );

async function createMoveToken( userId, gameId ) {
    bResult = await MoveTokens.create( { user_id: userId, game_id: gameId } )
    return bResult;
}

/**
 * Returns true if user_id has a move_token for game_id
 * @param {int} user_id 
 * @param {int} game_id 
 */
async function hasActiveMoveToken( userId, gameId ) {
    // Will need to add an expire date/time and check it
    // agains the current time
    const moveTokenCount = await MoveTokens.count( {
        where: {
            game_id: gameId,
            user_id: userId,
            active: 1
        } }
    );

    return moveTokenCount == 1;
}

/**
 * Deletes the move token indexed by userId and gameId
 * @param {int} userId 
 * @param {int} gameId 
 */
async function deactivateMoveToken( userId, gameId ) {
    // Set the active flag to false,
    MoveTokens.update(
        { active: 0 },
        { where: {
            user_id: userId,
            game_id: gameId
        }
    } );
}


/**
 * Generates a token to use to verify a user's email address
 * @param {int} userId
 * @returns token  The token value that was inserted
 */
async function createEmailVerificationToken( userId ) {
    return EmailVerifyToken.create( {
        user_id: userId,
        token: v4()
    } );
};

function getMailer() {
    return nodemailer.createTransport( {
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: ( process.env.ENV == 'production' ),
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    } );
}

/**
 * Sends an email for email verification
 * @param {object} user 
 * @param {string} token
 */
function sendEmailVerificationEmail( user, token ) {
    const transporter = getMailer();

    const subject = "Please verify your email address";
    const verifyUrl = `http://${process.env.WEBSITE_DOMAIN}/verifyemail/${token}`;

    const body = '<p>Please click the link to verifiy your email address</p>' +
                '<br />' + 
                "<a href='" + verifyUrl + "'>Verify your address</a>";

    let mailOptions = {
        from: process.env.EMAIL_FROM,
        to: user.email,
        subject: subject,
        html: body
    };

    transporter.sendMail( mailOptions, ( error, info ) => {
        if( error ) {
            console.log( error );
        } else {
            console.log( 'Email sent: ' + info.response );
        }
    } );
}

/**
 * Sends the contact email, from /contact
 * 
 * @param fromName  The name the user entered on the form
 * @param fromEmail The email address that the user entered on the form
 * @param message   The message from the form to send
 * @returns bool
 */
function sendContactMeEmail( fromName, fromEmail, message ) {
    if( ! fromName )
        fromName = 'Not Entered';

    const transporter = getMailer();

    const subject = "Contact Form from " + fromEmail;

    const body = 'Received Contact Us message from ' 
                        + fromName + ' at ' +fromEmail +
                '<br /><br />' + 
                'Message: ' + message;

    let mailOptions = {
        from: process.env.EMAIL_FROM,
        to: process.env.EMAIL_FROM,
        subject: subject,
        html: body
    };

    transporter.sendMail( mailOptions, ( error, info ) => {
        if( error ) {
            console.log( 'Error sending contact us email:', error );
        } else {
            console.log( 'Email sent: ' + info.response );
        }
    } );
}


module.exports = {
    hasActiveMoveToken, 
    deactivateMoveToken, 
    createMoveToken, 
    createEmailVerificationToken,
    sendEmailVerificationEmail,
    sendContactMeEmail,
};


