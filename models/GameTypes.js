// A model for the GameTypes table
var sequelize = require( './sequelize_initialize' )
	,Sequelize = require( 'sequelize' );

const GameTypes = sequelize.define( 'game_types', {
	id: {
		type: Sequelize.INTEGER,
		field: 'id',
		primaryKey: true,
		autoIncrement: true
	},

	name: {
		type: Sequelize.STRING(255),
		field: 'name',
		validate: {
			isAlpha: true
		}
	},

	prettyName: {
		type: Sequelize.STRING(255),
		field: 'prettyName',
		validate: {
			isAlpha: true
		}
	},

	description: {
		type: Sequelize.TEXT,
		field: 'description'
	},

	mapping: {
		type: Sequelize.INTEGER,
		field: 'mapping'
	}
},
{
	timestamps: false
} );

module.exports = GameTypes;
