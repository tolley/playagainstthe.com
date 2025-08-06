const mysql = require( "mysql2" );

async function connect() {
    var caFile = await fs.readFileSync( '/root/mysql_cert.pem' );

    var config = {
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
        port: 25060,
        ssl: true,
        dialect: 'mysql',
        dialectOptions: {
                ssl: {
                        ca: caFile
                }
        }
    };

    var connection = false;

    try {
        connection = await mysql.createConnection( config );
    } catch( err ) {
        console.log( err );
    }

    console.log( 'MySql DB connected' );

    return connection;
}

connect().then( ( res ) => {
    exports.connection = res;
} );