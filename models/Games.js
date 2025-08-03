const { name } = require('ejs');
var sequelize = require( './sequelize_initialize' )
	,Sequelize = require( 'sequelize' );
	// ,GameContent = require( './Game_content' );

var Games = sequelize.define( 'games', {
	id: {
		type: Sequelize.INTEGER(11).UNSIGNED,
		field: 'id',
		primaryKey: true,
		autoIncrement: true
	},
	owner_id: {
		type: Sequelize.INTEGER(11).UNSIGNED,
		field: 'owner_id'
	},
	game_type: {
		type: Sequelize.INTEGER(11).UNSIGNED,
		field: 'game_type'
	},
	status: {
		type: Sequelize.ENUM( 'individual', 'collective', 'finished' ),
		field: 'status'
	},
	result: {
		type: Sequelize.STRING,
		field: 'result'
	},
	move_data: {
		type: Sequelize.JSON,
		field: 'move_data'
	},
	label: {
		type: Sequelize.STRING,
		field: 'label'
	},
}, {
	timestamps: true,
	createdAt: 'create_date',
	updatedAt: 'last_update'
} );

module.exports = Games;