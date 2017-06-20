const UserData = require('../models/address');
// const AddrData = require('../models/address');

module.exports.address = async () => {
  return await UserData.find();
};

// module.exports.address = async () => {
//   return await AddrData.find();
// };

module.exports.getbyid = async (req,res) => {
  userid = req.params.userid;
  let data =  await UserData.find({ userid: userid });
  let jsonString = {"status":1,"code":"201","message":"User Details", "data": data}
// console.log(jsonString);
   return jsonString
};

// module.exports.savestudent = async (req,res) => {
//   let newStudent = Student({
//     name: req.body.name,
//     password: req.body.password
//   });
//   return await newStudent.save();
// };

module.exports.updateaddress = async (req,res) => {
  userid = req.params.userid;
  body = req.body;
  console.log(body);
  query = { userid: userid };
  const update = {
    $set: body,
  };
  
  let data =  await UserData.findOneAndUpdate(query,update,{ returnNewDocument : true })
  let jsonString = {"status":1,"code":"201","message":"User's Address Details Updated."}
// console.log(jsonString);
   return jsonString
};

// module.exports.deletestudent = async (req,res) => {
//   uname = req.params.uName;
//   return await Student.findOneAndRemove({ name: uname })
// };
