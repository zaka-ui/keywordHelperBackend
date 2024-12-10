const dotenv = require('dotenv');
const nodeMailer = require('nodemailer');




module.exports = async function sendEmail(message) {
    let transporter = null;
    
    try {
        if (process.env.P_STATUS === "dev") {
            transporter = nodeMailer.createTransport({
                host: '172.19.252.252',
                port: 1025,
                secure: false,
            });
        } else {
            // Production environment (Gmail)
            transporter = nodeMailer.createTransport({
                service: 'gmail', 
				port: 587,
				secure: false,
                auth: {
                    user: process.env.GMAIL_USER,
                    pass: process.env.GMAIL_PASSWORD,
                },
            });
        }
        
        await transporter.sendMail(message);
        return true;
    } catch (error) {
        console.error('Error sending email:', error); 
        return false;
    }
};
