const Games = require( '../models/Games' );

module.exports = {
    'move': async ( user_id, game ) => {
        const updateData = {};

        // If this is the game's owner and it's their turn
        if( game.dataValues.status == 'individual' && user_id == game.owner_id ) {
            updateData.status = 'collective';
        } else if( game.dataValues.status == 'collective' ) {
            updateData.status = 'individual';
        }

        Games.update(
            updateData,
            { where: {id: game.id} }
        );
    },
    'pass': ( user_id, game ) => {
        const updateData = {};

        // If this is the game's owner and it's their turn
        if( game.dataValues.status == 'individual' && user_id == game.owner_id ) {
            updateData.status = 'collective';
        } else if( game.dataValues.status == 'collective' ) {
            updateData.status = 'individual';
        }

        Games.update(
            updateData,
            { where: {id: game.id} }
        );
    },
    'forfeit': ( user_id, game ) => {
        const updateData = {
            status: 'finished'
        };
        
        Games.update(
            updateData,
            { where: {id: game.id} }
        );
    },
    'win': ( user_id, game ) => {
        const updateData = {
            status: 'finished'
        };

        Games.update(
            updateData,
            { where: {id: game.id} }
        );
    }
};
