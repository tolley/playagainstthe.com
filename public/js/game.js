// Included in main_view.ejs which should be most pages.

// gameJSLoad is called by dashboard.js using the DashboardOnLoads map
const gameJSLoad = ()  => {
    var path, game_id, game = false;

    if( location.hash.length > 0 ) {
        const urlParts = location.hash.split( '/' );
        path = '/' + urlParts[1] || "/home";

        if( urlParts[2] && ! isNaN( urlParts[2] ) )
            game_id = urlParts[2];
    }

    // If there's no game_id in the url, error
    if( ! game_id ) {
        alert( 'No Game Id found' );
        return;
    }

    // Load the game data
    $.get( '/game/' + game_id )
        .then( ( gameData ) => {
            game = gameData;
            if( gameComponentMap[game.game_type] ) {
                let bDisabled = ( game.status == 'collective' );
                gameComponentMap[game.game_type]( game, bDisabled, () => {} );
            }
        }
    );

    // ws is the websocket, this is defined in ./dashboard.js
    ws.onmessage = ( msg ) => {
        console.log( 'websocket message received in js/game.js, msg = ', msg );

        let msgData;
        if( msg.data ) {
            if( typeof msg.data === 'string' ) {
                try {
                    msgData = JSON.parse( msg.data );
                } catch ( e ) {
                    return;
                }
            } else {
                msgData = msg.data;
            }
        }
 
        let playArea = document.querySelector( 'div#game_board' );

        switch( msgData.action ) {
            case 'play':
                $.get( '/game/' + msgData.game_id ).then( ( gameData ) => {
                    showGame( playArea, gameData );
                } );
                break;
            case 'update':
                // If the user is currently viewing the game that came in
                // for an update
                if( msgData.game && msgData.game.id && 
                    msgData.game.id == game_id ) {
                        game = msgData.game;
                        if( gameComponentMap[msgData.game.game_type] ) {
                            let bDisabled = ( msgData.game.status == 'collective' );
                            gameComponentMap[msgData.game.game_type]( msgData.game, bDisabled, () => {} );
                        }
                }

                // Refresh the links in the side menu
                let listItem = document.querySelector( 'li.game_' + msgData.game.id );
                listItem.classList.remove( 'collective_turn', 'individual_turn' );
                if( msgData.game.status !== 'finished' ) {
                    listItem.classList.add( msgData.game.status + '_turn' );
                } else {
                    listItem.classList.add( 'finished' );
                }

                break;
            
            case 'toast':
                showToast( msgData.msg );
                break;
        }
    };
}

