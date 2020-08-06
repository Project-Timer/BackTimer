const mailconfig =  require('../config/mail.config');
const mailgun = require('mailgun-js')(mailconfig.GetConfig());

const sendResetPasswordEmail = () =>{
    console.log(mailconfig.GetConfig())
    let sender_email="cembuyuk7@gmail.com"
    let reciever_email="cembuyuk7@gmail.com"

    const subject = "test";
    const text = "testest";
    console.log('Test <'+sender_email+'>')
    const data = {
        "from":'Test <'+sender_email+'>',
        "to": reciever_email,
        subject: subject,
        text: text
    };
    mailgun.messages().send(data, function (error, body) {
        console.log(error)
        console.log(body);
        return body
    });
}
exports.sendResetPasswordEmail = sendResetPasswordEmail;