const ApplicationError = require('../errors/application.errors')

exports.errorHandler = (error, res) => {
    console.log(error)
    if (error instanceof ApplicationError) {
        res.status(error.status).json({message: error.message})
    } else {
        res.status(500).json({message: 'Error server'})
    }
}