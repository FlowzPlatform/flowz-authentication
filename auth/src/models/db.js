let mongoose = require('mongoose');

const { database, secret } = require('../config');
mongoose.Promise = global.Promise;

var options = {
    useMongoClient: true,
    db: {
        native_parser: true
    },
    server: {
        socketOptions: {
            keepAlive: 1
        }
    },
    mongos: {
      sslValidate: false
    },
    replset: {
        auto_reconnect: true ,
        connectWithNoPrimary: true,
        socketOptions: {
            keepAlive: 1,
            connectTimeoutMS: 5000,
        },
        strategy: 'ping',
        safe: { w: "majority", j: 1, wtimeout: 10000 }
    }
}

mongoose.connect(database, options)

var db = mongoose.connection;

db.on('connected', function () {
    console.log("Mongoose default connection is open to ", database);
});

 db.on('error', console.error.bind(console, 'connection error:'));

module.exports = mongoose;



























