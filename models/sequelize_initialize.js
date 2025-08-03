var Sequelize = require( 'sequelize' );

var sequelizeOpts = {
	host: process.env.MYSQL_HOST,
	dialect: 'mysql',
	logging: false
};

if( process.env.ENV == 'production' ) {
	sequelizeOpts.ssl = true;
	sequelizeOpts.dialectOptions = {
		ssl: {
			ca: fs.readFileSync( '/root/mysql_cert.pem'  ).toString()
		}
	}
}


module.exports = new Sequelize( 
	process.env.MYSQL_DATABASE,
	process.env.MYSQL_USER,
	process.env.MYSQL_PASSWORD,
	sequelizeOpts
);