const Home = () => {
    // userDetails is loaded on dashboard.js

    const payload = [`
        <div id="home">
            <h2>
                Welcome to your dashboard! 
            </h2>
            <p>This is where you can play against (or as one of) the collective.</p>
            <ul>
                <li>
                    <a href="javascript:showCreateGameModal();">Challenge</a>: 
                    Create your own game and make the opening move! Create as many as you want!
                </li>
                <li>
                    <a href="/dashboard#/play">Join</a>: Join the queue to make the
                    next move as a member of the collective in an anonymous game!
                </li>
                <li>
                    Moves made in collective games: ${userDetails.num_collective_moves}
                </li>
                <li>
                    Individual victories: ${userDetails.num_individual_victories}
                </li>
                <li>
                    Individual Defeats: ${userDetails.num_individual_defeats}
                </li>
            </ul>
        </div>
    `];

    return parseTemplate( payload );
};
