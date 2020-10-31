const mongoose = require('mongoose');
const getConnection = () => {
    if(process.env.NODE_ENV === 'development'){
        console.log('connected to mongodb container')
        return 'mongodb://' + process.env.DEV_DB_CONTAINER + "/" + process.env.DEV_DB_NAME
    }
    if(process.env.NODE_ENV === 'test'){
        console.log('connected to mongodb Test')
        return 'mongodb://localhost:27018/dbTest'
    }
    if(process.env.NODE_ENV === 'production'){
        console.log('mongodb+srv://'+process.env.PROD_DB_USER+':'+process.env.PROD_DB_PASSWORD+'@'+process.env.PROD_DB_CLUSTERName+'-3tthm.gcp.mongodb.net/'+process.env.PRD_DB_NAME+'?retryWrites=true&w=majority')
        return 'mongodb+srv://'+process.env.PROD_DB_USER+':'+process.env.PROD_DB_PASSWORD+'@'+process.env.PROD_DB_CLUSTERName+'-3tthm.gcp.mongodb.net/'+process.env.PRD_DB_NAME+'?retryWrites=true&w=majority'
    }
    return null;
}
const moogoseConnect = () =>{
    mongoose.Promise = global.Promise;
    mongoose.connect(getConnection(), {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true
    }).then(() => console.log('connected to db')).catch(err => console.log('MongoDB error when connecting: ' + err));
}


exports.moogoseConnect = moogoseConnect;