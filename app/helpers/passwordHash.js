const bcrypt = require('bcrypt');


const passwordHash = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
}





const verifyPassword = async (password, hashedPassword) => {
    const match = await bcrypt.compare(password, hashedPassword);
    if (match) {
        return true
    }
    return false;
}


module.exports = {passwordHash, verifyPassword};