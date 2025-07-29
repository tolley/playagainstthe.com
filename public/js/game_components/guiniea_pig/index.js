const guiniea_pig_component = ( game, bDisabled, onMoveComplete ) => {
    const boardSelector = 'div#game_board';

    // Load the game's history unless it's in the game object
    // Not sure if I want to store it jsonified in the mysql DB
    // or use a mongoDB.

    // Set up the game board
    renderBoard( game, bDisabled );

    document.querySelector( 'button#move' ).addEventListener( 'click', onMoveClick );
    document.querySelector( 'button#pass' ).addEventListener( 'click', onPassClick );
    document.querySelector( 'button#win' ).addEventListener( 'click', onWinClick );
    document.querySelector( 'button#forfeit' ).addEventListener( 'click', onForfeitClick );

    /////////////////////////////////////////////////////////////////////
    /////////////////////////// Methods /////////////////////////////////
    /////////////////////////////////////////////////////////////////////
    function renderBoard( game, bDisabled ) {
        const boardElem = document.querySelector( boardSelector );
        if( ! boardElem ) {
            throw 'Unable to find board element for quiniea pig';
        }

        while( boardElem.firstChild )
            boardElem.removeChild( boardElem.firstChild );
        
        if( game.status == 'finished' ) {
            const loadingTempl = [`
                <span id="tictactoe">
                    This game has finished! (Still need to render it 
                    with step controls! )
                </span>`];
            boardElem.appendChild( parseTemplate( loadingTempl ) );
            return;
        }

        // Should be: If the status is individual and the user isn't the owner
        // but you can't see the user's id on the front end
        //          disabled = 'disabled';
        var disabled = bDisabled? 'disabled': '';

        const payload = [`
            <span id="guiniea_pig">
                <h3>Guiniea Pig Game, use it test the plumbing!</h3>
                <br />
                <div id="guiniea_pig_board">
                    <button ${disabled} id="move">Move</button>
                    <button ${disabled} id="pass">Pass</button>
                    <button ${disabled} id="forfeit">Forfeit</button>
                    <button ${disabled} id="win">Win</button>
                </div>
            </span>
        `];
        
        boardElem.appendChild( parseTemplate( payload ) );
    }

    function disableUI() {
        document.querySelectorAll( '#guiniea_pig_board button' )
            .forEach( ( btn ) => {
                btn.disabled = true;
            } );
    }

    function onMoveClick() {
        const moveComplete = onMoveComplete;

        let packet = generateWSPacket( { action: 'move', game_id: game.id } );
        ws.send( packet );

        setTimeout( () => {
            disableUI();
            refreshGameMenu();

            if( moveComplete && typeof moveComplete == 'function' ) {
                moveComplete( document.querySelector( boardSelector ) );
            }
        }, 100 );
    };

    function onPassClick() {
        let packet = generateWSPacket( { action: 'pass', game_id: game.id } );
        ws.send( packet );
        disableUI();
    };

    function onWinClick() {
        let packet = generateWSPacket( { action: 'win', game_id: game.id } );
        ws.send( packet );
        disableUI();
    };

    function onForfeitClick() {
        let packet = generateWSPacket( { action: 'forfeit', game_id: game.id } );
        ws.send( packet );
        disableUI();
    };
}