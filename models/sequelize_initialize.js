fs = require( 'fs' );
var Sequelize = require( 'sequelize' );

module.exports = new Sequelize( 
	process.env.MYSQL_DATABASE,
	process.env.MYSQL_USER,
	process.env.MYSQL_PASSWORD,
	{
		host: process.env.MYSQL_HOST,
		dialect: 'mysql',
		logging: false,
		port: process.env.MYSQL_PORT, 
		dialectOptions: {
			ssl: {
				ca: fs.readFileSync( '../db.pem' )
			}
		}
	}
);