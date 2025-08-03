// Included on the login.ejs

// console.log( 'in login.js, document.currentScript = ', document.currentScript );

const loginJSLoad = () => {
    const loginForm = $( 'form#login-form' );

    loginForm.submit(function(e) {
        e.preventDefault();

        const formErrorSelector = 'form#login-form span.form_error';
        const errorSpan = document.querySelector( formErrorSelector );

        while( errorSpan.firstChild )
            errorSpan.removeChild( errorSpan.firstChild );

        $.ajax( {
            url: e.currentTarget.action,
            type: 'POST',
            dataType: 'text',
            data: loginForm.serialize(),
            success: ( data ) => {
                // Send the user to their dashboard
                window.location = '/dashboard';
            },
            error: ( xhr, status, error ) => {
                const errorMsg = document.createElement( 'span' );
                errorMsg.class = 'error';
                errorMsg.innerHTML = error;
                errorSpan.appendChild( errorMsg );
            }
        } );
    } );
}

if( window.addEventListener ) {
    window.addEventListener( 'load', loginJSLoad, false );
} else if( window.attachEvent ) { 
    window.attachEvent('onload', loginJSLoad );
}