var sequelize = require( './sequelize_initialize' )
	,Sequelize = require( 'sequelize' );

const CollectiveQueue = sequelize.define( 'collective_queue', {
        id: {
            type: Sequelize.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        name: {
            type: Sequelize.STRING(255),
            unique: true,
            allowNull: false,
        },
        game_type: {
            type: Sequelize.INTEGER.UNSIGNED,
            allowNull: false,
        },
        create_date: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW,
        },
        last_update: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        },
    }, {
        tableName: 'collective_queue',
        timestamps: false, // Using triggers for create_date and update_date
    },
);

module.exports = CollectiveQueue;
