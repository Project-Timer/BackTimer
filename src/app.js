const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const express = require('express');
const port = process.env.SRV_PORT || process.env.SERVER_PORT // For Heroku app process.env.SERVER_PORT

const authRoute = require('./routes/userRoute');
const groupRoute = require('./routes/groupRoute');


const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors());

//MongoDB connects
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://' + process.env.DB_CONTAINER + "/" + process.env.DB_NAME, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true
}).then(() => console.log('connected to db: ' + process.env.DB_CONTAINER + "/" + process.env.DB_NAME)).catch(err => console.log('MongoDB error when connecting:' + err));


//Middleware
authRoute(app);
groupRoute(app);

console.log('Host: ' + process.env.SRV_HOST + ' / Port server: ' + port);
app.listen(port, process.env.SRV_HOST);

module.exports = app; // for testing