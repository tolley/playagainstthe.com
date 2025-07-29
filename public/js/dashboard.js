// This is the javascript for the dashboard
var collectiveQueues = false;
var ws = false;

// const websocket_url = process.env.WEBSITE_WS_FULL_URL;
const websocket_url = 'ws://10.253.54.120:8081';

// A mapping of game component objects by game_type
const gameComponentMap = {
    // The value needs to be a method to render the page and handle the game logic
    // This should take care of everything to do with playing/viewing the game
    1: tictactoe_component,
    2: checkers_component,
}

// The onload method to set up the events on the page
const dashboardLoad = ( app ) => {

    // Connect to the server through a websocket
    if( ! ws ) {
        console.log( 'Creating WS in js/dashboard.js' );
        ws = new WebSocket( websocket_url );
    }

    if( ! collectiveQueues ) {
        $.get( '/collective_queue', ( data ) => {
            collectiveQueues = data;
            
            // Rerender the dashboard as this is a promise
            render();
        } );
    }

    // Renders the dashboard view based on the current url
    const render = () => {
        let path = '/home';
        let game_id = false;

        if( location.hash.length > 0 ) {
            const urlParts = location.hash.split( '/' );
            path = '/' + urlParts[1] || "/home";

            game_id = false;
            if( urlParts[2] && ! isNaN( urlParts[2] ) )
                game_id = urlParts[2];
        }
        
        const viewData = {
            gameTypes: gameTypes,
            game_id: game_id,
            collectiveQueues: collectiveQueues
        };

        const view = DashboardRoutes[path];
        const container = document.getElementById("dashboard_container");
        while( container.firstChild )
            container.removeChild( container.firstChild );

        if( view ) {
            container.appendChild( view( viewData ) );
        } else {
            container.textContent = "404 - Page not found";
        }

        // If there is an onload method, call it. Turns out script tags 
        // created through innerHTML don't execute
        if( DashboardOnLoads[path] ) {
            DashboardOnLoads[path]();
        }

        refreshGameMenu();
    };

    // Plug into the url change event, like when the location.hash changes
    // on link click.
    window.addEventListener( "hashchange", render );
    window.addEventListener( "DOMContentLoaded", render );
    // render( Home );
};

// Plug into the logout link's click
if( window.addEventListener ) {
    window.addEventListener( 'load', dashboardLoad, false );
    // window.addEventListener( 'unload', () => { alert( 'unloading 1' ); } );
} else if( window.attachEvent ) { 
    window.attachEvent( 'onload', dashboardLoad );
    // window.attachEvent( 'unload', () => { alert( 'unloading 2' ); } );
}
