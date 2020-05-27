const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const express = require('express');
const port = process.env.SRV_PORT || process.env.SERVER_PORT // For Heroku app process.env.SERVER_PORT

const authRoute = require('./routes/userRoute');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors());

//MongoDB connects
mongoose.Promise = global.Promise;
const uri = "mongodb+srv://workandoutuser:g43dm8y8@workandoutcluster0-3tthm.gcp.mongodb.net/test?retryWrites=true&w=majority";
mongoose.connect(uri, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true
}).then(() => console.log('connected to db: ' + process.env.DB_CONTAINER + "/" + process.env.DB_NAME)).catch(err => console.log('MongoDB error when connecting:' + err));


//Middleware
authRoute(app);

console.log('Host: ' + process.env.SRV_HOST + ' / Port server: ' + port);
//app.listen(port, process.env.SRV_HOST);
app.listen(port, function() {
    console.log("app litening on port 3000")
})
module.exports = app; // for testing