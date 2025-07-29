const checkers_component = ( game, bDisabled, onMoveComplete ) => {
    const boardSelector = 'div#game_board';

    // Set up the game board
    renderBoard( game, bDisabled );

    function renderBoard( game, bDisabled ) {
        const boardElem = document.querySelector( boardSelector );
        if( ! boardElem ) {
            throw 'Unable to find board element for checkers';
        }

        while( boardElem.firstChild )
            boardElem.removeChild( boardElem.firstChild );

        var gameBoard = new checkerBoard( game, boardElem, onMoveComplete );
    }
}
