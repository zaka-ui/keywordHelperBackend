const jwt = require('jsonwebtoken');
const { Role } = require('../models/User');
const { where } = require('sequelize');





const generateToken = (user) => {
    const token = jwt.sign(
        { id: user.id, email: user.email },  // Payload
        process.env.API_SECRET_KEY,          // Secret key
    );

    return token;
}


module.exports = {generateToken};
