const nodemailer = require('nodemailer');
const sendEmail = async (options) => {
    // 1) create transporter (service send like 'Gmail','mailtrap','mailgun','sendGrid)
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: true,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass : process.env.EMAIL_PASSWORD
        }
    })
    // 2) Define email options (like : from , to , subject , content ,etc)
    const mailOpt = {
        from: 'Nour Ahmad <noorahmad123456bm@gmail.com>',
        to: options.email, 
        subject: options.subject,
        text : options.message
    }
    // 3) Send email
    return await transporter.sendMail(mailOpt);
} 

module.exports = sendEmail; 