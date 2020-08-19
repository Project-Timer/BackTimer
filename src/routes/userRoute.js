const verify = require('../utils/jwt')
module.exports = (app) => {
    let userController = require('../controllers/userController')
    app.route('/register')
        .post(userController.create_user);
    app.route('/login')
        .post(userController.login_user);
    app.route('/users')
        .get(verify.requiredToken, userController.get_all_user)
        .delete(verify.requiredToken,userController.delete_user);
   app.route('/user')
       .put(verify.requiredToken,userController.update_user);
   app.route('/user/:user_id')
       .get(verify.requiredToken,userController.get_user)
   app.route('/logout')
       .get(verify.requiredToken, userController.logout);
}
