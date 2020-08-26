const verify = require('../utils/jwt')
module.exports = (app) => {
    let timerController = require('../controllers/timerController')
    app.route('/timer/')
        .post(verify.requiredToken, timerController.setTimer);
    app.route('/timer/:id')
        .put(verify.requiredToken, timerController.updateTimer)
        .delete(verify.requiredToken, timerController.deleteTimer);
    app.route('/timers/project/:id')
        .get(verify.requiredToken, timerController.getTimerByProject);
    app.route('/timers/user/:id')
        .get(verify.requiredToken, timerController.getTimerByUser);
}