var sequelize = require( './sequelize_initialize' )
  ,Sequelize = require( 'sequelize' );

var EmailVerifyToken = sequelize.define( 'email_verify_token', {
    id: {
      type: Sequelize.INTEGER(11).UNSIGNED,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    user_id: {
      type: Sequelize.INTEGER(11).UNSIGNED,
      allowNull: false
    },
    token: {
      type: Sequelize.STRING(255),
      allowNull: false
    },
    create_date: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    },
    last_update: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    }
  }, {
    tableName: 'email_verify_token',
    timestamps: true,
    createdAt: 'create_date',
    updatedAt: 'last_update'
} );

module.exports = EmailVerifyToken;
