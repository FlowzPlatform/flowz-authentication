let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let studentSchema = new Schema({
  name: String,
  password: { type: String, required: true },
  created_at: Date,
  updated_at: Date
});

let Student = mongoose.model('Student',studentSchema)

module.exports = Student
