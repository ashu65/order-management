//Import the mongoose module
var mongoose = require('mongoose');
var config = require('../../../config/config');

//Set up default mongoose connection
var mongoDB = config.mongo_config.db_host + config.mongo_config.db_name;
mongoose.connect(mongoDB, { useNewUrlParser: true });

//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
