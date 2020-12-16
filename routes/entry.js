const entryController = require('../controller/entryController')
module.exports = (app) => {
    app.post('/api/v1/login',entryController.loginWithEmailAndPassword)
}