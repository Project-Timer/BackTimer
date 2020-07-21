const verify = require('../utils/jwt')
module.exports = (app) => {
    let timerController = require('../controllers/timer')
    app.route('/timer/add')
        .post(verify.requiredToken, timerController.createTimer);
    app.route('/timer/:id')
        .get(verify.requiredToken, timerController.getTimerById)
        .put(verify.requiredToken, timerController.updateTimer)
        .delete(verify.requiredToken, timerController.deletetimer)
    app.route('/timers/')
        .get(verify.requiredToken, timerController.getTimer)
}