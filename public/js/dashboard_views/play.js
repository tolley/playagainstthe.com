const Play = ( viewData ) => {
    // Build the options string for the queue select
    let queueOpts = '';
    if( queueOpts.length == 0 ) {
        for( let n = 0; n < viewData.collectiveQueues.length; ++n ) {
            queueOpts += `<option value="${viewData.collectiveQueues[n].id}">
                            ${viewData.collectiveQueues[n].name}
                        </option>`;
        }// End for n
    }// End if

    var message = '<p>When someone creates a Challenge, that challenge is passed to us ' +
                'after the creator (the individual) makes each of their moves.  It\'s ' +
                'your job now to make those opposing moves!</p>';
    message += '<br />';

    message += '<p>You can exit the queue at any time if you need a break, or if you want ' +
                'switch to a different game type, but you must make a move each time you ' +
                'are given the opportunity to.</p>';
    message += '<br />';

    message += '<p>You will not be given the option to make a move in a game that you started ' +
                'nor will you be shown who started a game.  The individual that started ' +
                'the game will not be shown who made each move.</p>';
    message += '<br />';

    message += '<p>Need something to do while you wait, join the collective and make a few ' + 
                'moves, do your part to keep the queues clear</p>';

    message += '<br />';

    const payload = [`
        <div id="game_board">
            <h1>Welcome to the collective!</h1>
            <br />
            <h2>Choose a game type and join the fun!</h2>
            <br />

            <select id="collective_queue" name="queue">
                ${queueOpts}
            </select>
            <button onClick="joinQueue()">Join</button>
            <br /><br />

            ${message}
        </div>
    `];

    return parseTemplate( payload );
};
