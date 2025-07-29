/**
 * This will contain a list of active users gathered into queues
 * The queue id comes from the collective_queue table
 */

/**
 * Ex:
 *    queues = {
 *      queueId<int>: [userId, userId, userId],
 *      queueId<int>: [userId]
 *    }
 */
var queues = {};


// Methods for interacting with the queue.  Queues are
// created when the first person joins it, so we need
// save ways to interact with it


module.exports = {
    wsQueueActions: {
        'join': async ( user_id, q_id ) => {
            console.log( 'asfasdfasdfasfasdfasf user_id = ', user_id );
            console.log( 'q_id = ', q_id );
            console.log( 'before, queues = ', queues );

            // queues is an object, the properties are 
            // arrays of user ids. 
            if( ! queues[q_id] )
                queues[q_id] = [];
            
            if( ! queues[q_id].includes( user_id ) )
                queues[q_id].push( user_id );

            console.log( 'after, queues = ', queues );
        },

        'leave': async ( user_id, q_id ) => {
            if( queues[q_id] && queues[q_id] && 
                    queues[q_id].hasOwn( user_id ) ) {
                queues[q_id] = queues[q_id].filter( ( n ) =>  { return n != user_id } );
            }
        }
    },
    wsQueues: queues
};

