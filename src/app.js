const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const express = require('express');
const moogose = require('./config/db.config')
const authRoute = require('./routes/userRoute');
const groupRoute = require('./routes/groupRoute');
const projectRoute = require('./routes/projectRoute');
const timerRoute = require('./routes/timerRoute');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors());

moogose.moogoseConnect()

//Middleware
authRoute(app);
groupRoute(app);
projectRoute(app);
timerRoute(app);

app.listen(process.env.NODE_ENV === "development" ? process.env.DEV_SRV_PORT : process.env.PORT, () =>{
    if(process.env.NODE_ENV === "development"){
        console.log('App Listening on Host: ' + process.env.SRV_HOST + ' / Port server: ' + process.env.DEV_SRV_PORT);
    }else{
        console.log("App Launch")
        console.log(process.env.PORT)
    }
})
module.exports = app;