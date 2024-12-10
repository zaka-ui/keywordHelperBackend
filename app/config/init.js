const dotenv = require('dotenv');
const fs = require('fs');
const crypto = require('crypto');
const readline = require('node:readline');
const {passwordHash, verifyPassword} = require('../helpers/passwordHash');
const {User, Role} = require('../models/User');
const Project = require('../models/Project');
const Result = require('../models/Results');
const sequelize = require("../config/config")
const process = require('process');
const { exec } = require("child_process");


const roles = ['admin', 'user'];
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
const fields = ["name", "email", "password"];


const askQuestion = (question) => {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer);
        });
    });
};


const collectUserData = async () => {
    const user = {}
    for (const field of fields) {
        const value = await askQuestion(`Please enter your ${field}: `);
        user[field] = value;
        console.log(`your email ${field} is : ${value}`);
    }
    rl.close();
    return user
};


const initServer = async () => {
    try {
        if(!process.env.API_SECRET_KEY){
            console.error("please provide and api key");
            return false;
        }
	await sequelize.sync({});
        let user = await User.findByPk(1);
        if (user){
            return true;
        }
        console.info('Database synchronized successfully.');
        for (const role of roles) {
            await Role.findOrCreate({where: { name: role }, defaults: { name: role }});
        }
        console.info('Roles are created successfully.');
        const {name, email, password} = await collectUserData();
        user = await User.findOne({where : {email : email}});
        if (!user){
            const roleResult = await Role.findOne({ where: { name: "admin"} });
            const hashPassword = await passwordHash(password);
            user = await User.create({name, email, password: hashPassword, roleId : roleResult.id})
            console.info('_________________Your account:_________________________');
            console.info(`Hi ${user.name} here is your account\nemail: ${user.email}\npassword: ${password}`)
            console.info('__________________________________________');
        }
        return true;
    } catch (error) {
        console.error('Unable to sync the database:', error);
        return false;
    }
};







module.exports = initServer;
