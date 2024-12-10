const nodeMailer = require('nodemailer');
const {User, Role, sequelize } = require('../../models/User');
const {UserTokens} = require('../../models/UserTokens');
const {passwordHash, verifyPassword} = require('../../helpers/passwordHash');
const {removeBykeys}  = require('../../helpers/userValidation');
const {generateResetEmailHtml} = require('../../helpers/email')
const {generateToken}  = require('../../helpers/generateToken');
require('dotenv').config();
const authRoutes = require('../../routes/authRoutes');
const sendMail = require('../../helpers/emailSend');
const crypto = require('crypto');


const setAuthRoutes = (router) => {
    for (const route of authRoutes) {
        	if(route.method === "POST" &&  route.path === "/login"){
            		router.post(route.path, logIn);
        	}
		if (route.method === "POST" && route.path === "/logout"){
			router.post(route.path, logout);
		}
		if (route.method === "POST" && route.path === "/forgotPassword"){
			router.post(route.path, forgotPassword); 
		}
        	if (route.method === "POST" && route.path === "/resetPassword"){
			router.post(route.path, resetPassword);
		}
		if (route.method === "POST" && route.path === "/verifyResetToken"){
			router.post(route.path, verifyResetToken);
		}
		if (route.method === "POST" && route.path === "/verifyEmail"){
			router.post(route.path, verifyEmail);
		}
    }
};


const logIn = async (req, res) => {
    if (Object.keys(req.body).length < 1) {
        return res.status(400).json({error : "Missing password or email"}); 
    }
    const {email, password} = req.body;
    const user = await User.findOne({where: {email}, include : { model :Role}});
	if (user == null){
		return res.status(404).json({'error' : 'password or email are incorrect'});
	}
    const match = await verifyPassword(password, user.password);
    if (!match){
        return res.status(404).json({'error' : 'password is incorrect'});
    }
    const token = generateToken(user);
    res.cookie('jwt', token, {
        httpOnly: true,
        maxAge: 259200000,
	SameSite: 'Strict',
	secure : false,
    });
    const userData = removeBykeys(user.get(), ["password"]);
    return res.json({token, userData});
}



const verifyEmail = async (req, res) => {
	const {token} = req.body	
	try{
		if (!token){
			return  res.json({error : "token is missing"})
		}
		const user_token = await UserTokens.findOne({
            		where: { email_verification_token: token },
            		include: User});
		if (!user_token || !user_token.User) {
            		return res.status(404).json({ error: "Token is not valid token" });
       		}
		const user = user_token.User;
		user.is_verified = true;
		await user.save();
		await user_token.destroy();
		return res.json({ message: "user has been verified"});
	}catch(error){
		console.error("Error verifying the email verification token:", error);
        	return res.status(500).json({ message: "Internal server error" });
	}
}
		




const forgotPassword = async (req, res) => {
	const {email} = req.body
	if (!email){
		return res.json({error: "email is missing"});
	}
	const user = await User.findOne({where: {email}, include : UserTokens})
	if (user === null) {
		return res.status(404).json({error: "Email not found"});
	}
	let user_token = user.UserTokens;
	const token =  crypto.randomBytes(5).toString('hex');
	const expiration = new Date(Date.now() + 30 * 60 * 1000);
	if (user_token){
		await user_token.update({password_rest_token : token,
			expiration, user_id : user.id});
	}else{
		user_token = await UserTokens.create({password_rest_token : token,
			expiration, user_id : user.id});
		if (!user_token){
			res.json({error: "Could not create the token"});
		}
	}
	const template  = await generateResetEmailHtml(user, token);
	const message = {
		from : process.env.GMAIL_USER,
		to: email,
		subject : "Reset your password",
		html : template
	};

	try {
		await sendMail(message);
		return res.json({message : "Chek your email box for more details."});	
	}catch(error){
		return res.status(500).json({ error : error.message});
	}
	
}


const verifyResetToken = async (req, res) => {
    const { token } = req.body;
    try {
	if (!token){
		return res.json({error : 'missing token'});
	}
        const user_token = await UserTokens.findOne({
            where: { password_rest_token: token },
            include: User,
        });
        if (!user_token || !user_token.User) {
            return res.status(404).json({ error: "Token is not valid or expired" });
        }
        const user = user_token.User;
        await sequelize.query('CALL RemoveExpireDate(:userId)', {
            replacements: { userId: user.id },
            type: sequelize.QueryTypes.RAW,
        });
        return res.json({ message: "Token is valid" });
    } catch (error) {
        console.error("Error verifying reset token:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};




const resetPassword = async (req, res) => {
	const { password, confirmation, token } = req.body;
	if (!token){
		return res.json({error : "token is missing"});
	}
	if (!password || !confirmation) {
	  return res.status(400).json({ error: "Missing password or the password confirmation" });
	}
  
	if (password !== confirmation) {
	  return res.status(400).json({error: "Password must match the confirmation" });
	}
	try {
		const user_token = await UserTokens.findOne({
			where: { password_rest_token: token },
			include: User
		});
		if (!user_token || !user_token.User) {
			return res.status(403).json({ error: "Unauthorized" });
		}
		const user = user_token.User;
		if (!user_token.expiration || user_token.password_rest_token !== token) {
			return res.status(401).json({ error: "Unauthorized" });
		}
		const hashedPass = await passwordHash(password);
		user.password = hashedPass;
		await user.save();
		await user_token.destroy();
		return res.json({ message: "Password has been updated successfully" });
  
	} catch (error) {
	  console.error("Error during password reset:", error);
	  return res.status(500).json({ message: "Failed to reset password. Please try again." });
	}
};
  





const logout = (req, res) => {
	res.clearCookie('jwt', { httpOnly: true});
	return res.json({ message: 'Logged out successfully' });
};


module.exports = {setAuthRoutes};
