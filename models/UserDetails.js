var sequelize = require( './sequelize_initialize' )
	,DataTypes = require( 'sequelize' );

// const { DataTypes } = require('sequelize');
const UserDetails = sequelize.define( 'user_details', {
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },

    user_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
    },

    num_collective_moves: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0
    },

    num_individual_victories: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0
    },

    num_individual_defeats: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0
    }, 
    
    sound: {
        type: DataTypes.TINYINT(1),
        allowNull: false,
        default: 1
    }
    }, {
        tableName: 'user_details',
        timestamps: false
    } 
);

module.exports = UserDetails;
