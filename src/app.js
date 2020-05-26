const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const express = require('express');


const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors());

//MongoDB connect
mongoose.Promise = global.Promise;
const mongooseParams = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true
};
mongoose.connect('mongodb://' + process.env.DB_CONTAINER + "/" + process.env.DB_NAME, mongooseParams,
    () => console.log('connected to db: ' + process.env.DB_CONTAINER + "/" + process.env.DB_NAME));

console.log('Host: ' + process.env.SERVER_HOST + ' / Port server: ' + process.env.SERVER_PORT);
app.listen(process.env.SERVER_PORT, process.env.SERVER_HOST);

module.exports = app; // for testing