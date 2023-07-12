const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
    service: 'gmail', // e.g., 'gmail'
    auth: {
        user: 'donextweb@gmail.com',
        pass: 'nnpyrrlvmbkismus',
    },
});

const sendMail = (options, cb) => {
    transporter.sendMail({...options, from: 'donextweb@gmail.com'}, (error, info) => cb(error, info));
}

module.exports = sendMail