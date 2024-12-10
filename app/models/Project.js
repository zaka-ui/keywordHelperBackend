const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');
const {User} = require('./User');


const Project = sequelize.define('Project', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name : {
        type: DataTypes.STRING,
        allowNull: false,
    },
    projectDomaineName: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    description : {
        type: DataTypes.TEXT,
        allowNull: false
    },
    note : {
        type :DataTypes.TEXT,
        allowNull : true,
     }
}, {
    tableName : "projects",
});


User.hasMany(Project , {
    onDelete: 'CASCADE',

});
Project.belongsTo(User);



module.exports = Project;