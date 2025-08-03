const mysql = require( "mysql2" );

async function connect() {
    var config = {
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE
    };

    if( process.env.ENV == 'production' ) {
        config.dialectOptions = {
            ssl: {
                // CAUTION: there are better ways to load the certificate, see comments below
                ca: fs.readFileSync( '/root/mysql_cert.pem'  ).toString()
            }
        }
    }

    var connection = false;

    try {
        connection = await mysql.createConnection( config );
    } catch( err ) {
        console.log( err );
    }

    console.log( 'MySql DB connected' );

    return connection;
}

connect().then((res) => {
    console.log( 'here in database.js then' );
    exports.connection = res;
});