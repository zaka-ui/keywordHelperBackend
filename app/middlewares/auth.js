const jwt = require('jsonwebtoken');



const auth = (req, res, next) => {
    //const token = req.cookies['jwt'];
    const authHeader = req.headers["authorization"];
    console.log("ya weld kaba");
    
    if (!authHeader) {
	 return res.status(401).json({ message: 'Unauthorized' });
    } 
    const [type, token] = authHeader.split(' ');
    if (type !== 'Bearer' ||!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    jwt.verify(token, process.env.API_SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Forbidden: Invalid or expired token' });
        } 
        req.user = decoded;
        next();
    });
};





module.exports = {auth};
