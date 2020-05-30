const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const express = require('express');
let server_port = ""
if (process.env.NODE_ENV === 'development') {
    server_port = process.env.DEV_SRV_PORT;
} else if (process.env.NODE_ENV === 'production') {
    server_port = process.env.PORT
}
const authRoute = require('./routes/userRoute');
const groupRoute = require('./routes/groupRoute');


const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors());

//MongoDB connects
mongoose.Promise = global.Promise;
let uri = ""
if (process.env.NODE_ENV === 'development') {
    console.log("HELLO");
    uri = 'mongodb://' + process.env.DB_CONTAINER + "/" + process.env.DEV_DB_NAME;
} else if (process.env.NODE_ENV === 'production') {
    uri = "mongodb+srv://" + process.env.PROD_DB_USER + ":" + process.env.PROD_DB_PASSWORD + "@workandoutcluster0-3tthm.gcp.mongodb.net/test?retryWrites=true&w=majority";
}
mongoose.connect(uri, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true
}).then(() => console.log('connected to db')).catch(err => console.log('MongoDB error when connecting:' + err));

//Middleware
authRoute(app);
groupRoute(app);

app.listen(server_port, () => {
    console.log('App Listening on Host: ' + process.env.SRV_HOST + ' / Port server: ' + server_port);
})
module.exports = app; // for testing