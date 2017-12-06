// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model(
  'auth_configs',
  new Schema({ ldapUrl:String,ldapDc:String,adminDn:String, adminPass:String },{ strict:false }),
  'auth_configs'
);
