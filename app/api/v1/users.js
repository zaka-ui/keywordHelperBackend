const {UserTokens} = require('../../models/UserTokens');
const {validator, removeBykeys}  = require('../../helpers/userValidation');
const {passwordHash, verifyPassword} = require('../../helpers/passwordHash');
const {generateEmailVerificationHtml, generateResetEmailHtml} = require('../../helpers/email')
const {User, Role} = require('../../models/User');
const {auth} = require('../../middlewares/auth')
const {admin} = require('../../middlewares/admin')
const userRoutes = require('../../routes/usersrRoutes');
const sendMail = require('../../helpers/emailSend');





const setUserRoutes = (router) => {
    //router.all('*', auth, admin)
    for (const route of userRoutes) {
        if (route.method === "GET" && route.path === '/users/:id'){
            router.get(route.path, showUser);
        }
	else if (route.method === 'GET' && route.path === '/users'){
	    router.get(route.path, showUsers);
	}
        else if(route.method === "POST" && route.path === '/users'){
            router.post(route.path, createUser);
        }
	else if(route.method === "PUT" && route.path === '/users'){
            router.put(route.path, updateUser);
        }
	else if(route.method === "DELETE" && route.path === '/users/:id') {
            router.delete(route.path, deleteUser);
        }
    }
};



const showUser = async (req, res) => {
    const {id} = req.params;
    let user = await User.findByPk(id, {include : Role });
    if (user){
        const userData = removeBykeys(user.get(), ["password"]);
        return res.json(userData)
    }else{
        return res.status(401).json({
            message : "user not found"
        });
    }
    
}

const showUsers = async (req, res) => {
    const limitStr = req.query.limit;
    const offsetStr = req.query.offset;
    const limit = parseInt(limitStr, 10) || 10;
    const offset = parseInt(offsetStr, 10) || 0;
    const users = await User.findAll({limit, offset, Include : Role});
    if (users){
        const totaleSize = await User.count();
        const pageSize = limit;
        const totalPages = Math.ceil(totaleSize / pageSize);
        const info = {totaleSize, pageSize, totalPages, offset}; 
        users.map((user) => removeBykeys(user.get(), ['password']))
        return res.json([info, users]);
    }
    return res.json([]);
}




const createUser = async (req, res) => {
    try{
        const errors = await validator(req.body, User);
        if (Object.keys(errors).length > 0) {
            return res.status(400).json(errors); 
        }
        const { name, email, password, role} = req.body;
        if (!role || role == ""){
            role = 'user';
        }
        const roleResult = await Role.findOne({ where: { name: role } });
        if (!roleResult) {
            return res.status(400).json({ message: 'Role must be an admin or a user' });
        }
        const hashedPass = await passwordHash(password);
        let user = await User.create({ name, email, password: hashedPass, roleId : roleResult.id});
        const template = await generateEmailVerificationHtml(password,user, UserTokens);
        const message = {
            from : process.env.GMAIL_USER,
            to: email,
            subject : "Email verification",
            html : template
        };
        await sendMail(message);
        return res.status(200).json({ message: 'User created successfully'});
    }catch(error){
        console.info(error)
    }
};







const updateUser =  async (req, res) =>{
	const {id} = req.params;
	let user = await User.findByPk(id, {include : Role});
	if (user === null) {
		return res.status(404).json({message : "user not found"});
	}
	const {name, email, password, role} = req.body;
    if (role){
        const roleResult = await Role.findOne({ where: { name: role } });
        user.roleId = roleResult.id;
    }
	user.name = name;
	user.email = email;

	if (password) {
		user.password = await passwordHash(password);
	}
	await user.save();
    user = removeBykeys(user.get(), ['password']);
	return res.json(user);
}




const deleteUser =  async (req, res) =>{
	const {id} = req.params;
    let user = await User.findByPk(id, {include : Role});
    if (user === null) {
		return res.status(404).json({message : "user not found"});
	}

    await user.destroy();
    return res.json({message : "user is deleted successfully"})
}




module.exports = { setUserRoutes };

