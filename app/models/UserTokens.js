const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');
const {User} = require('./User');


const UserTokens = sequelize.define('UserTokens', {
    password_rest_token: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    email_verification_token:{
        type: DataTypes.STRING,
        allowNull: true,
    },
    expiration: {
        type: DataTypes.DATE,
        allowNull: true,
    },
},{
    timestamps: false,
});



User.hasOne(UserTokens, { foreignKey: 'user_id' });
UserTokens.belongsTo(User, { foreignKey: 'user_id' });


module.exports = {UserTokens};
