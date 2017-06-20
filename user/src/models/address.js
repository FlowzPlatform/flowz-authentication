let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let PersonalInfo = new Schema({
  firstname: String,
  lastname: String,
  emailid : String,
  userid : String
});

let Personal = mongoose.model('students',PersonalInfo)

module.exports = Personal //UserData
