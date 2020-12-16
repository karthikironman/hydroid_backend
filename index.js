// Init dependencies
const express = require('express')
var app = express()
var bodyParser = require('body-parser')
require("dotenv").config();
// console.log('env',app.get('env'))

const database = require('./database/database')
const port = process.env.SERVER_PORT
const modeType = process.env.mode

// process.env.NODE_ENV = 'development';
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Headers"
    );
    next();
});
app.use(bodyParser({ limit: '50mb' }));
app.use(bodyParser.json({}))
app.use(bodyParser.urlencoded({ extended: true }))
require('./routes')(app)
app.listen(port, (() => { console.log('server is running on', port) }))