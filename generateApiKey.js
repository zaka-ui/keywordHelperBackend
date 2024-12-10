const crypto = require('crypto');




const generateApiToken = () => {
    return crypto.randomBytes(15).toString('hex');
}
       



console.log(generateApiToken())