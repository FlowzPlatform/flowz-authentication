let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let PersonalInfo = new Schema({
  firstname : String,
  lastname : String,
  email : String,
  userid : String
});

let Pinfo = mongoose.model('tests',PersonalInfo)

module.exports = Pinfo
