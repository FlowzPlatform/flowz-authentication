let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let PersonalInfo = new Schema({
  firstname : String,
  lastname : String,
  email : String,
  userid : String
}, {
    collection: 'personalInformation'
});

let Pinfo = mongoose.model('personalInformation',PersonalInfo)

module.exports = Pinfo
