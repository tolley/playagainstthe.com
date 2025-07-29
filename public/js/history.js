
var finishedGames = null;

function historyOnload() {
    const grid = new gridjs.Grid({
        columns: [{
            data: ( row ) => {
                const link = document.createElement( 'a' );
                link.innerHTML = `${getGameTypeNameById( row.game_type ) + ' ' + row.id }`;
                link.href = '/dashboard#/game/' + row.id;
                return link;
            },
            name: 'Game'
        }, {
            data: ( row ) => row.result,
            name: "Winner"
        },{
            data: ( row ) => {
                dateObj = new Date( row.create_date );
                return dateObj.toLocaleDateString()
            },
            name: "Date Started"
        },{
            data: ( row ) => {
                return new Date( row.create_date ).toLocaleDateString()
            },
            name: "Date Finished"
        }],

        pagination: {
            limit: 20
        },
        sort: true,
        resizable: true,
        width: '100%',
        data: () => {
            return $.ajax({
                url: '/game?status=finished',
                method: 'GET',
                dataType: 'json'
            }).promise()
        }
    });

    grid.render( document.getElementById( 'previous_games' ) );

    // // const previousGameTable = document.querySelector( 'span#previous_games table' );
    // const previousGameTableRows = document.querySelector( 'span#previous_games table tr' );

    // // Remove all existing games
    // while( previousGameTableRows > 0 ) {
    //     tableRows[0].parentNode.removeChild( tableRows[0] );
    //     console.log( 'tableRows = ', tableRows );
    // }

    // $.get( '/game?status=finished', ( data ) => {
    //     finishedGames = data;
    //     data.forEach( addGameToPreviousGameTable );
    // } );
}


function addGameToPreviousGameTable( game ) {
    const previousGameTable = document.querySelector( 'span#previous_games table' );

    const startDate = new Date( game.create_date );
    const endDate = new Date( game.last_update );

    const payload = [`<tr>
                        <td>
                            <a href="/dashboard#/game/${game.id}">
                                ${getGameTypeNameById( game.game_type ) + ' ' + game.id }
                            </a>
                        </td>
                        <td>
                            ${game.result}
                        </td>
                        <td>
                            ${startDate.toLocaleDateString()}
                        </td>
                        <td>
                            ${endDate.toLocaleDateString()}
                        </td>
                    </tr>`];
    
    previousGameTable.appendChild( parseTemplate( payload ) );
}


if( window.addEventListener ) {
    window.addEventListener( 'load', historyOnload, false );
} else if( window.attachEvent ) { 
    window.attachEvent( 'onload', historyOnload );
}