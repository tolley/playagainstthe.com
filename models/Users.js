var sequelize = require( './sequelize_initialize' )
	,Sequelize = require( 'sequelize' );

var Users = sequelize.define( 'users', {
	// Define fields for the users table
	id: { 
		type: Sequelize.INTEGER(11).UNSIGNED,
		field: 'id',
		primaryKey: true,
		autoIncrement: true
	},
	username: {
		type: Sequelize.STRING,
		field: 'username'
	},
	password: {
		type: Sequelize.STRING,
		field: 'password'
	},
	email: {
		type: Sequelize.STRING,
		field: 'email'
	},
	verified_email: {
		type: Sequelize.BOOLEAN,
		field: 'verified_email'
	},
	source: {
		type: Sequelize.STRING,
		field: 'source'

	},
	source_id: {
		type: Sequelize.STRING,
		field: 'source_id'
	}
}, {
	// Configure the timestamps with our custom field names
	timestamps: true,
	createdAt: 'create_date',
	updatedAt: 'last_update',

	// setterMethods: {
	// 	password: function( value ) {
	// 		this.setDataValue( 'password', Sha1.hash( config.hashKey + value ) );
	// 	}
	// }
} );

// Users.sync();

module.exports = Users;