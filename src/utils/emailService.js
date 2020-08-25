const HTMLGenerator = require('./HTMLGenerator');
const AWS = require('aws-sdk');
const config = require('../config/mail.config');
const ApplicationError = require("../errors/application.errors");
/**
 * Init AWS configuration
 * @return object AWS
 * */
const initMailService = () => {
    AWS.config.update({
        accessKeyId: config.aws.key,
        secretAccessKey: config.aws.secret,
        region: config.aws.ses.region
    });
    return new AWS.SES({apiVersion: '2010-12-01'});
}
/***
 * Send confirmation email
 *  @param {string} token user confirmation token
 *  @param {string} recipient
 *  @param {string} firstName
 */
exports.confirmEmail = async (token, recipient, firstName) => {
    let from;
    const ses = initMailService()
    const html = await HTMLGenerator.HTMLGenerator({
        template: 'confirmationMail',
        params: {
            token: token,
            firstName: firstName
        }
    });
    if (process.env.NODE_ENV === "development") {
        from = process.env.SEND_MAIL_DEV
    } else {
       from = process.env.SEND_MAIL
    }

    const params = {
        Destination: {
            ToAddresses: [recipient]
        },
        Message: {
            Body: {
                Html: {
                    Charset: 'UTF-8',
                    Data: html
                }
            },
            Subject: {
                Charset: 'UTF-8',
                Data: 'Please confirm your Work and Out account',
            }
        },
        ReturnPath: from ? from : config.aws.ses.from.default,
        Source: from ? from : config.aws.ses.from.default,
    }
    ses.sendEmail(params, (error) => {
        if (error) {
            throw new ApplicationError(error.stack)
        }
    });
}