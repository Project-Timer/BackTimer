const verify = require('../utils/jwt')
module.exports = (app) => {
    let projectController = require('../controllers/projectController')
    app.route('/project')
        .post(verify.requiredToken, projectController.createProject);
    app.route('/project/:id')
        .get(verify.requiredToken, projectController.getProjectById)
        .put(verify.requiredToken, projectController.updateProject)
        .delete(verify.requiredToken, projectController.deleteProject)
    app.route('/projects/')
        .get(verify.requiredToken, projectController.getAllProjects)
}