const verify = require('../utils/jwt')
module.exports = (app) => {
    let groupController = require('../controllers/groupController')
    app.route('/group/add')
        .post(verify.requiredToken, groupController.createGroup);
    app.route('/groups')
        .get(groupController.getGroupsList);
    app.route('/groups/:user_id')
        .get(groupController.getGroups);

    app.route('/group/:group_id')
        .get(groupController.getGroupById)
        .put(groupController.updateGroup)
        .delete(groupController.deleteGroup);




}