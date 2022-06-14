const nodemailer = require('nodemailer')
require("dotenv").config()

const { HOST, PORTEMAIL, USER, PASSWORD } = require('../config/keys');

exports.kirimEmail = dataEmail => {
    let transporter = nodemailer.createTransport({
        host: HOST,
        port: PORTEMAIL,
        secure: false,
        requireTLS: true,
        auth: {
            user: USER,
            pass: PASSWORD
        },
    });
    return (
        transporter.sendMail(dataEmail)
            .catch(err => console.log(`Error: ${err}`))
    )
}