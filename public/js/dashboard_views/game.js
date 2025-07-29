const Game = ( viewData ) => {
    // Check the url for a game id
    const payload = [`
        <div id="game_board">
            <marquee>Loading...</marquee>
        </div>
    `];

    return parseTemplate( payload );
}