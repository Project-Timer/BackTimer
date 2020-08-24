const verify = require('../utils/jwt')
module.exports = (app) => {
    let groupController = require('../controllers/groupController')
    app.route('/group')
        .post(verify.requiredToken, groupController.createGroup);
    app.route('/group/:id')
        .get(verify.requiredToken, groupController.getGroupById)
        .put(verify.requiredToken, groupController.updateGroup)
        .delete(verify.requiredToken, groupController.deleteGroup);
    app.route('/groups')
        .get(verify.requiredToken, groupController.getAllGroups);
    app.route('/groups/user/:id')
        .get(verify.requiredToken, groupController.getGroupsByUser);
}