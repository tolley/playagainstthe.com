// playJSLoad is called by dashboard.js using the DashboardOnLoads map
var playArea;

const collChime = new Audio( '/audio/collective_chime.mp3' );

const playJSLoad = async () => {
    // ws is the websocket, this is defined in ./dashboard.js
    ws.onmessage = ( msg ) => {
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
 
        playArea = document.querySelector( 'div#game_board' );

        switch( msgData.action ) {
            case 'play':
                $.get( '/game/' + msgData.game_id ).then( ( gameData ) => {
                    showGame( playArea, gameData );

                    if( userDetails?.sound )
                        collChime.play();
                } );
                break;

            // case 'update':
            //     // I think I can reload the game here if need be, not sure if the update 
            //     // packet is being received in play or game
            //     console.log( "May need to reload the game here in update" );
            //     break;

            case 'toast':
                showToast( msgData.msg );
                break;

            case 'wait':
            default:
                showLoading( playArea );
                break;
        }
    };
};

// Called when the user wants to join a collective queue
function joinQueue() {
    const queueSelect = document.querySelector( 'select#collective_queue' );
    const qId = queueSelect.value;

    let packet = generateWSPacket( { 
                        action: 'join',
                        queue_id: qId
                    } );
    ws.send( packet );

    // Load the UI to reflect our position in the queue
    const playArea = document.querySelector( 'div#game_board' );
    showLoading( playArea );

    // Hide the join link, and show the exit link
    document.querySelector( 'a#join_queue' ).style.display = 'none';
    document.querySelector( 'a#exit_queue' ).style.display = 'block';
}


// Called when the user wants to exit the queue
function exitQueue() {
    let packet = generateWSPacket( { action: 'exit' } );
    ws.send( packet );

    document.querySelector( 'a#exit_queue' ).style.display = 'none';
    document.querySelector( 'a#join_queue' ).style.display = 'block';

    // Show the main screen
    if( playArea )
        showLoading( playArea );
}

// Renders the game into the playing area
function showGame( container, game ) {
    while( container.firstChild ) {
        container.removeChild( container.firstChild );
    }

    // Show our game along with an enabled UI
    let bDisabled = false;
    gameComponentMap[game.game_type]( game, bDisabled, () => {

        // pause the reload here, not sure how that's going to look
        setTimeout( () => {
            showLoading( container );
        }, 1500 );
    } );
}

function showLoading( container ) {
    while( container.firstChild ) {
        container.removeChild( container.firstChild );
    }

    let waitingMsg = document.createElement( 'div' );
    waitingMsg.className = 'queued';
    waitingMsg.innerHTML = `<span>Looking for available game</span>
                            <br />
                            <a href="/dashboard">Leave Queue</a>`;
    container.appendChild( waitingMsg );
}

