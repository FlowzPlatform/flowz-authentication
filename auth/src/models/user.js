// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model(
  'User',
  new Schema({ username: String, password: String, email: String, fullname: String, token: String,forgetpassword: String,created_by:Date,updated_by:Date }),
  'User'
);
