const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');
const Project = require('./Project');


const Result = sequelize.define('Result', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },

    keyword : {
        type: DataTypes.STRING,
        allowNull : false,
    },
    keyword_difficulty:{
        type: DataTypes.INTEGER,
	allowNull : true,
    },
    search_volume : {
        type: DataTypes.INTEGER,
        validate: {
            min : 0,
        }
    },
    parent_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    }
},{
     tableName: 'results',
});


Project.hasMany(Result);
Result.belongsTo(Project)
module.exports =  {Result, Project};
