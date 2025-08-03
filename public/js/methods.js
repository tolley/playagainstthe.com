/** A bunch of methods needed by in dashboard.js.
 *  These must be included first.
 */

/**
 * This method will rendere a template, which is string contained in backticks
 * Usage example: The test method will return a test page
 * const Test = () => {
        return parseTemplate(`
            <b>This is a test</b>
        )`;
    };
*/
function parseTemplate( strings, ...values ) {
    const html = strings.reduce( (result, str, i ) => {
        const val = values[i] != null ? values[i] : "";
        return result + str + val;
    }, "" );

    // Use a template element to parse as a DOM tree
    const template = document.createElement( 'template' );
    template.innerHTML = html.trim();
    return template.content.firstElementChild;
}


function showCreateGameModal() {
    // Create our modal and show the user the create game fields
    const modal = document.createElement( 'div' );
    modal.className = 'modal_dialog';
    modal.id = 'create_game_modal_container';

    // Load the markup for the create game modal
    modal.appendChild( CreateGame( gameTypes ) );

    // Remove any previously opened modals and add this one
    const container = document.querySelector( 'div#modal_content' );
    while( container.firstChild )
        container.removeChild( container.firstChild );

    container.appendChild( modal ); 
}


// Called to create a new game. Sends the player to it's page
// on completion
function doCreateGame( gameTypeId ) {
    if( ! gameTypeId )
        return;

    let createData = {
        game_type: gameTypeId
    };

    $.ajax( {
        url: '/game',
        type: 'PUT',
        data: createData,
        success: ( data ) => {
            // Send the user to the game itself and remove the dialog
            location.href = '/dashboard#/game/' + data.id;
            removeModalDOM();
            addGameLink( data );
        } 
    } );
}


// Removes all of the game links from the side menu
// so they don't get doubled up on menu reload
function removeSidebarGameLinks() {
    const menu = document.querySelector( 'ul#sidebar_nav' );

    const gameLinks = menu.querySelectorAll( 'li.game_link' );
    for( let n = 0; n < gameLinks.length; ++n ) {
        menu.removeChild( gameLinks[n] );
    }
}


/**
 * Returns game_type.prettyName where id = game_type.id
 * @param {int} id cooresponds to game_type.id
 * @param return The prettyName for the game type
 */
function getGameTypeNameById( id ) {
    if( ! gameTypes || gameTypes?.length == 0 )
        return 'Unknown';

    for( var n = 0; n < gameTypes.length; ++n ) {
        if( gameTypes[n].id == id )
            return gameTypes[n].prettyName;
    }
}

// Adds a game link in the sidebar menu
function addGameLink( game ) {
    // Don't add finished games to the side menu, they will
    // be shown in /history
    if( game.status == 'finished' )
        return;

    const menu = document.querySelector( 'ul#sidebar_nav' );
    const newItem = document.createElement( 'li' );
    newItem.className = 'game_link game_' + game.id + ' game_type_' + game.game_type;
    
    const newLink = document.createElement( 'a' );
    newLink.href = '/dashboard#/game/' + game.id;
    
    newLink.innerHTML = getGameTypeNameById( game.game_type ) + ' ' + game.id;

    switch( game.status ) {
        case 'collective':
            newItem.classList.add( 'collective_turn' );
            newLink.title = "Awaiting a move from the .com";
            break;
        case 'individual':
            newItem.classList.add( 'individual_turn' );
            newLink.title = "It's your turn!"
            break;
        // case 'finished':
        //     newItem.classList.add( 'finished' );
        //     newLink.title = "Game Complete: " + game.result;
        //     break;
    }

    newItem.appendChild( newLink );
    menu.insertBefore( newItem, document.querySelector( 'li#finished_games_li' ) );
}


// Removes any/all modal dialogs from the DOM
function removeModalDOM() {
    const modalContainer = document.querySelector( 'div#modal_content' );
    while( modalContainer.firstChild )
        modalContainer.removeChild( modalContainer.firstChild );
}


// Formats data to be sent from the front end to the back end via WS
function generateWSPacket( data ) {
    return JSON.stringify( data );
}


function toggleMenu() {
    const nav = document.getElementById( "sidebar_nav" );

    if( nav.style.display === "block" ) {
        nav.style.display = "none";
        nav.classList.add( 'desktop_only' );
    } else {
        nav.style.display = "block";
        nav.classList.remove( 'desktop_only' );
    }
}


// Shows a toast to the user
function showToast( msg ) {
    const container = document.querySelector( '#dashboard_notifications' );

    const toast = document.createElement( 'div' );
    toast.className = 'toast';
    if( typeof msg == "string" ) {
        toast.innerHTML = msg;
    } else {
        toast.appendChild( msg );
    }

    container?.appendChild( toast );
    
    setTimeout( () => {
        toast.style.animation = 'fadeOut 2s';
    }, 6000 );
    setTimeout( () => {
        toast.parentElement.removeChild( toast );
    }, 7000 );
}
