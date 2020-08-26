const HTMLGenerator = require('./HTMLGenerator')
const AWS = require('aws-sdk')
const ApplicationError = require("../errors/application.errors")
/**
 * Init AWS configuration
 * @return object AWS
 * */
const initMailService = () => {
    AWS.config.update({
        accessKeyId: process.env.key,
        secretAccessKey: process.env.secret,
        region: process.env.region
    })
    return new AWS.SES({apiVersion: '2010-12-01'})
}

/***
 * Send an email with a token
 *  @param {string} token user confirmation token
 *  @param {string} recipient
 *  @param {string} firstName
 */
exports.sendTokenEmail = async (token, recipient, firstName, template) => {
    let from
    const ses = initMailService()
    const html = await HTMLGenerator.HTMLGenerator({
        template: template,
        params: {
            token: token,
            firstName: firstName
        }
    })
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
    })
}