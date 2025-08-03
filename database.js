const mysql = require( "mysql2" );

async function connect() {
    const config = {
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE
    };

    var connection = false;

    try {
        connection = await mysql.createConnection( config );
    } catch( err ) {
        console.log( err );
    }

    return connection;
}

connect().then((res) => {
    console.log( 'here in database.js then' );
    exports.connection = res;
});