const Student = require('../models/user');

module.exports.liststudent = async () => {
  return await Student.find();
};

module.exports.getstudent = async (req,res) => {
  uname = req.params.uName;
  return await Student.find({ name: uname });
};

module.exports.savestudent = async (req,res) => {
  let newStudent = Student({
    name: req.body.name,
    password: req.body.password
  });
  return await newStudent.save();
};

module.exports.updatestudent = async (req,res) => {
  uname = req.params.uName;
  body = req.body;
  console.log(body);
  query = { name: uname };
  const update = {
    $set: body,
  };
   return await Student.findOneAndUpdate(query,update,{ returnNewDocument : true })
};

module.exports.deletestudent = async (req,res) => {
  uname = req.params.uName;
  return await Student.findOneAndRemove({ name: uname })
};
