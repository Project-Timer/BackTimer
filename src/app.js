const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const express = require('express');
const server_port = process.env.SRV_PORT || process.env.PORT

const authRoute = require('./routes/userRoute');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors());

//MongoDB connects
mongoose.Promise = global.Promise;
const uri = "mongodb+srv://workandoutuser:g43dm8y8@workandoutcluster0-3tthm.gcp.mongodb.net/test?retryWrites=true&w=majority";
//const uri ='mongodb://' + process.env.DB_CONTAINER + "/" + process.env.DB_NAME;
mongoose.connect(uri, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true
}).then(() => console.log('connected to db')).catch(err => console.log('MongoDB error when connecting:' + err));

//Middleware
authRoute(app);

app.listen(server_port, () =>{
    console.log('App Listening on Host: ' + process.env.SERVER_HOST + ' / Port server: ' + server_port);
})
module.exports = app; // for testing