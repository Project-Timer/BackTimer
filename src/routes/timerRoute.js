const verify = require('../utils/jwt')
module.exports = (app) => {
    let timerController = require('../controllers/timerController')
    app.route('/timer/set')
        .post(verify.requiredToken, timerController.setTimer);
    app.route('/timers/list')
        .get(verify.requiredToken, timerController.getTimersList);
    app.route('/timer/get/:id')
        .get(verify.requiredToken, timerController.getTimerById)
        .delete(verify.requiredToken, timerController.deleteTimer);
    app.route('/timers/project/:id')
        .get(verify.requiredToken, timerController.getTimerByProject);
    app.route('/timers/user/:id')
        .get(verify.requiredToken, timerController.getTimerByUser);
}