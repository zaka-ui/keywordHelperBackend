const { User, Role } = require('../models/User');



const admin = async (req, res, next) => {
    const sender = await User.findByPk(req.user.id,  {include: Role});
    if (!sender){
        return res.status(403).json({error : "acces denied"});
    }
    const senderRole = sender.Role ? sender.Role.name : false;
    if (senderRole !== "admin"){
        return res.status(403).json({error : "acces denied"});
    }
    next();
}





module.exports = {admin};
