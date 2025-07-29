const sockets = {};

const wsManager = ( function() {
    return {
        get( userId ) {
            return sockets[userId] || null;
        },

        add( userId, ws ) {
            if (!userId ) {
                throw new Error( 'Can not add a socket without a user id' );
            }

            console.log( 'Adding user to socket list: ' + userId + '-------------------' );
            console.log( 'here in objects/ws_manager adding ', userId );
            
            sockets[userId] = ws;
        },

        delete( userId ) {
            if( userId in sockets ) {
                delete sockets[userId];
                return true;
            }
            return false;
        },

        getAll() {
            return { ...sockets };
        }
  };
})();

module.exports = wsManager;