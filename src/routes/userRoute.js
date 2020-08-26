const verify = require('../utils/jwt')
module.exports = (app) => {
    let userController = require('../controllers/userController')
    app.route('/register')
        .post(userController.register);
    app.route('/resend-validation/')
        .post(userController.resendValidation)
    app.route('/validate/:token')
        .post(userController.validateAccount)
    app.route('/login')
        .post(userController.login);
    app.route('/request-pass')
        .post(userController.forgotPassword);
    app.route('/resend-pass')
        .post(userController.resendPassword);
    app.route('/reset-pass/:token')
        .post(userController.resetPassword);
    app.route('/users')
        .get(verify.requiredToken, userController.getAllUser)
    app.route('/user')
        .put(verify.requiredToken,userController.updateUser)
        .delete(verify.requiredToken,userController.deleteUser);
    app.route('/user/:id')
        .get(verify.requiredToken,userController.getUserById)
    app.route('/logout')
        .get(verify.requiredToken, userController.logout);
}
