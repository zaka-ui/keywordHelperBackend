

const validator = async (userData = {} , userModel = {}) =>{
    const errors = {};
    const expectedPrames  = ["name", "email", "password", "confirmation", "role"];
    const emailRegex ="^[^\\s@]+@[^\\s@]+\\.[^\\s@]{1,3}$";
    const userSendedKeys = Object.keys(userData);
    const missingKeys = expectedPrames.filter((exp) => !userSendedKeys.includes(exp));
    const required = [];
    if (missingKeys.length  > 0){
        errors[ "Missing keys" ] =  missingKeys;
    }
    for (const[key, value] of  Object.entries(userData)){
        if (!value || value === ''){
            required.push(`${key} is required`);
        }
    }

    if (required.length > 0){
        errors['required'] =  required;
    }
    if (userData.email){
        if (!userData.email.match(emailRegex)){
            errors.email = ['Email must be a correct email format'];
        }
    }
    
    if (userSendedKeys.includes("email")) {
        if (! await isUnique(userModel, {email :  userData.email})) {
            errors.email = errors.email || [];
            errors.email.push('Email must be unique');
        }
    }  

    if (userData.password !== userData.confirmation){
        errors.password = 'password  must match the password confirmation';
    }
    return errors
};




const isUnique = async (userModel, fields) => {
    const user =  await userModel.findOne({where: fields});
    if (user) {
        return false;
    }
    return true;  
}



const removeBykeys = (userData, fields) => {
    if (userData && !Array.isArray(userData)){ 
        for (const key of fields){
            if (userData[key]){
                delete userData[key]
            }
        }
    }
    return userData
}


module.exports = {validator, removeBykeys};
