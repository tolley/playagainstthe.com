// A model for the MoveTokens table
var sequelize = require( './sequelize_initialize' )
	,Sequelize = require( 'sequelize' );

/*
What is a move token? When the collective queue matches an individual game 
to an individual in the collective, a move token will be inserted. If a move 
is made by a player, the backend will verify that the user has a valid token
before accepting their move. This allows for security as well as helps to enforce
a time limit for a given individual in a collective so that they can't just hang
a game up by walking away from their browser for who knows how long
*/

var MoveTokens = sequelize.define( 'move_tokens', {
	id: {
		type: Sequelize.INTEGER,
		field: 'id',
		primaryKey: true,
		autoIncrement: true
	},

	game_id: {
		type: Sequelize.INTEGER,
		field: 'game_id'
	},
	user_id: {
		type: Sequelize.INTEGER,
		field: 'user_id'
	},
	active: {
		type: Sequelize.TINYINT,
		field: 'active'
	}
}, {
	timestamps: true,
	createdAt: 'create_date',
	updatedAt: 'last_update'
} );

module.exports = MoveTokens;