fs = require( 'fs' );
var Sequelize = require( 'sequelize' );

const path = require( 'path' );

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
				ca: fs.readFileSync(__dirname + '/../db.pem', {text_encoding: "utf8"} )
			}
		}
	}
);
