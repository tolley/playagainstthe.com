const signupJSLoad = () => {
    $( '#signup-form' ).submit( ( evt ) => {
        evt.preventDefault();

        // Remove all error messages from the form
        $( '#signup-form span.form_error' ).remove();

        let usernameField = $( '#username' )[0];
        let emailField = $( '#email' )[0];
        let passwordField = $( '#password' )[0];
        let repeatPasswordField = $( '#repeat_password' )[0];
        
        let valid = true;

        if( ! usernameField || ! usernameField.value ) {
            $( '#username' ).after( '<span class="form_error">You must enter a username</span>' );
            valid = false;
        }

        if( ! emailField || ! emailField.value || 
            ! emailField.value.match(
                /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ )
        ) {
            $( '#email' ).after( '<span class="form_error">Please enter a valid email address</span>' );
            valid = false;
        }

        if( ! passwordField || ! passwordField.value ) {
            $( '#password' ).after( '<span class="form_error">You must enter a password</span>' );
            valid = false;
        }

        if( ! repeatPasswordField || ! repeatPasswordField.value ) {
            $( '#repeat_password' ).after( '<span class="form_error">You must repeat your password</span>' );
            valid = false;
        }

        if( passwordField.value != repeatPasswordField.value ) {
            $( '#password' ).after( '<span class="form_error">Password and Repeat Password do not match</span>' );
            valid = false;
        }
        
        // If the form is valid, create our new user
        if( valid ) {
            const data = {
                username: usernameField.value,
                email: emailField.value,
                password: passwordField.value,
                repeat_password: repeatPasswordField.value
            };

            $.post( "/signup", data, ( resp ) => {
                if( resp.id && resp.email ) {
                    // Let the user know that the signup worked
                    window.location.replace( '/welcome' );
                } else if( resp.errors && resp.errors.length > 0 ) {
                    resp.errors.forEach( ( error ) => {
                        $( '#signup_submit' ).after( '<span class="form_error"><br />' + error + '<br /></span>' );
                    } );

                } else {
                    $( '#signup_submit' ).after( '<span class="form_error">Unable to create user at this time, please again.</span>' );
                }
            } );
        }
    } );
};

if( window.addEventListener ) {
    window.addEventListener( 'load', signupJSLoad, false );
} else if( window.attachEvent ) { 
    window.attachEvent('onload', signupJSLoad );
}