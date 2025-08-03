// Included in main_view.ejs which should be most pages.

var gameTypes = false;
var userDetails = false;

if( ! gameTypes ) {
    $.get( '/game_types', ( data ) => {
        gameTypes = data;
    } );
}

if( ! userDetails ) {
    $.get( '/userdetails', ( data ) => {
        userDetails = data;
    } );
}

async function refreshGameMenu() {
    $.get( '/game', ( data ) => {
        removeSidebarGameLinks();

        for( var n = 0; n < data.length; ++n ) {
            addGameLink( data[n] );
        }
    } );
}

refreshGameMenu();

const mainJSLoad = () => {
    $( 'a#logout' ).on( 'click', ( evt ) => {
        $.get( '/logout', ( data, status ) => {
            window.location.replace( '/' );
        } );
    } );
}

if( window.addEventListener ) {
    window.addEventListener( 'load', mainJSLoad, false );
} else if( window.attachEvent ) { 
    window.attachEvent('onload', mainJSLoad );
}