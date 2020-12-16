const entryController = require('../controller/entryController')
module.exports = (app) => {
    app.post('/api/v1/login',entryController.loginWithEmailAndPassword)
    app.post('/api/v1/register',entryController.register)
}