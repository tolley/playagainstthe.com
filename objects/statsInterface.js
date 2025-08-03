// A collection of methods to quickly update the user's stats
// const UserDetails = require( '../models/UserDetails' );
const sequelize = require( '../models/sequelize_initialize' );

/**
 * Adds one to the number of moves a user has made against the collective
 * @param {int} userId 
 */
function countCollectiveMove( userId ) {
    const sql = `update user_details
                 set num_collective_moves = num_collective_moves + 1
                 where user_id = ${userId}`;
    sequelize.query( sql );
}

/**
 * Adds one to the number of games against the collective this user has won
 * @param {int} userId 
 */
function addVictory( userId ) {
    const sql = `update user_details
                 set num_individual_victories = num_individual_victories + 1
                 where user_id = ${userId}`;
    sequelize.query( sql );
}

/**
 * Adds one to the number of games against the collective this user has lost
 * @param {int} userId 
 */
function addDefeat( userId ) {
    const sql = `update user_details
                 set num_individual_defeats = num_individual_defeats + 1
                 where user_id = ${userId}`;
    sequelize.query( sql );
}

module.exports = { countCollectiveMove, addVictory, addDefeat };