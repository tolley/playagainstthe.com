/**
 * 
 * @param {array} gameTypes An array of game_type data objects
 * @returns The renderd creategame template, internal to the dashboard
 */
const CreateGame = ( viewData ) => { 
    var gameTypesHTML = '';
    for( var n = 0; n < viewData.length; ++n ) {
        gameTypesHTML += `<div class="game_type_link">
                            <h3>
                                ${viewData[n].prettyName}
                            </h3>
                            <span>
                                ${viewData[n].description}
                            </span>
                            <br />
                            <a href="javascript:doCreateGame(${viewData[n].id})">
                                Start a new game of ${viewData[n].prettyName}
                            </a>
                        </div>`;
    }

    const payload = [`
        <div id="create_game">
            <span class="close_btn" onClick="javascript:removeModalDOM()">
                X
            </span>
            <p>
                Start a game of your choice!  Once you've made the first move, your game
                will enter the queue, where the .com can make it's move!
                <br />
                <br />
                Close your browser if you need to, when you come back your game
                will still be here, and it might be your turn!
            </p>
            ${gameTypesHTML}
        </div>
    `];

    return parseTemplate( payload );
};