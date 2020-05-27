const verify = require('../utils/jwt')
module.exports = (app) => {
    let userController = require('../controllers/userController')
    app.route('/register')
        .post(userController.create_user);
    app.route('/login')
        .post(userController.login_user);
   app.route('/user')
       .get(verify.requiredToken, userController.get_all_user);
   app.route('/user/:user_id')
       .get(userController.get_user)
       .delete(userController.delete_user)
       .put(userController.update_user);

}