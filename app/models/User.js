const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');


const Role = sequelize.define('Role', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name : {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
},
);

const User = sequelize.define('User',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name : {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        password :{
            type: DataTypes.STRING,
            allowNull: false,
        }, 
        is_verified : {
            type: DataTypes.BOOLEAN,
            defaultValue : 0,
            allowNull : false
        },
        roleId: { type: DataTypes.INTEGER }
    },
    {
        timestamps: true,
    }
);




User.belongsTo(Role, { foreignKey: 'roleId' });
Role.hasMany(User, { foreignKey: 'roleId' });



module.exports = {User, Role , sequelize};