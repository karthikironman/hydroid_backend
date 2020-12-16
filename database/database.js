const mongoose = require('mongoose')
require("dotenv").config();
// const server = 'mongodb://localhost:27017'
const server = process.env.MONGOURI
const databaseName = process.env.DATABASE_NAME
console.log('srevdv',server,databaseName)
class Database {
    constructor() {
        this.connect()
    }
    connect() {
        mongoose.connect(`${server}/${databaseName}`,{
        // mongoose.connect(server, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify:false
            
        }).then(() => {
            console.log('Database connection successful')
        }).catch(err => {
            console.error('Database connection error')
        })
    }

}
module.exports = new Database()