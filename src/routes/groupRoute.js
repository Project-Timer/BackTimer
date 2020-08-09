            const verify = require('../utils/jwt')
module.exports = (app) => {
    let groupController = require('../controllers/groupController')
    app.route('/group/add')
        .post(verify.requiredToken, groupController.createGroup);
    app.route('/groups')
        .get(verify.requiredToken, groupController.getGroupsList);
    app.route('/groups/:user_id')
        .get(verify.requiredToken, groupController.getGroups);
    app.route('/group/:group_id')
        .get(verify.requiredToken, groupController.getGroupById)
        .put(verify.requiredToken, groupController.updateGroup)
        .delete(verify.requiredToken, groupController.deleteGroup);
}