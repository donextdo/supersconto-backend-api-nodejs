import nodemailer from 'nodemailer'



const transporter = nodemailer.createTransport({
    host: 'smtp.hostinger.com',
    port: 587,
    secure: false,
    auth: {
        // user: email,
        // pass: password'
    }
})


const sendEmail = async (subject, to, html) => {
    try {
        let info = await transporter.sendMail({
            // from: 'email',
            to: to, // list of receivers
            subject: subject, // Subject line
            // text: "Hello world?", // plain text body
            html: html, // html body
        })
    
        return info
    }
    catch (error) {
        console.log(error)
    }
    
}

export default sendEmail