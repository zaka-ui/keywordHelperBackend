require('dotenv').config();
const crypto = require('crypto');





const generateResetEmailHtml = async (userData, token) => {
	const htmlTemplate = `
		<h1>Hello, ${userData.name}</h1>
		<p>We received a request to change your password.</p>
		here is your token: <span style='font-weight:bold;'>${token}<span>
	`
	return htmlTemplate;
}



const generateEmailVerificationHtml = async (password, userData, UserTokens) => {
	const token =  crypto.randomBytes(10).toString('hex');
	const userToken = await UserTokens.create(
		{email_verification_token : token, user_id : userData.id});
	if (!userToken){
		res.json({message: "Could not create the token"});
	}
	console.log(process.env.FRONT_END_URL);
	const htmlTemplate =`
		<h1>Hello, ${userData.name}</h1>
		<p>password is :${password}<p>
		<p>Please click on this link to verfiy your account
		<a href="${process.env.FRONT_END_URL}/users/emailverification?token=${token}">${process.env.FRONT_END_URL}</a></p>
	`
	return htmlTemplate;
}





module.exports = {generateResetEmailHtml, generateEmailVerificationHtml}
