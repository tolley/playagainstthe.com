var fs = require( 'fs' );

var Sequelize = require( 'sequelize' );

var sequelizeOpts = {
	host: process.env.MYSQL_HOST,
	port: process.env.MYSQL_PORT,
	dialect: 'mysql',
	logging: false
};

if( process.env.ENV == 'production' ) {
	var caFile = fs.readFileSync( '/root/mysql_cert.pem'  ).toString();

	sequelizeOpts.ssl = true;
	sequelizeOpts.dialectOptions = {
		ssl: {
			require: true,
			rejectUnauthorized: true,
			ca: caFile
		}
	}
}

module.exports = new Sequelize(
	process.env.MYSQL_DATABASE,
	process.env.MYSQL_USER,
	process.env.MYSQL_PASSWORD,
	sequelizeOpts
);