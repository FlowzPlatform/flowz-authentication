const User = require('../models/user');
module.exports.alluserdetails = async () => {
  let data =  await User.find()
  let jsonString = {"status":1,"code":"201","message":"alluserdetails","data":data}
// console.log(jsonString);
   return jsonString
};
module.exports.getuserdetails = async (req,res) => {
  email = req.params.email;
  let data = await User.find({ email: email })
  let jsonString = {"status":1,"code":"201","message":"getuserdetails","data":data}
// console.log(jsonString);
   return jsonString
};
// module.exports.savestudent = async (req,res) => {
//   let newUser= User({
//     name: req.body.name,
//     password: req.body.password
//   });
//   return await newStudent.save();
// };
module.exports.updateuserdetails = async (req,res) => {
  email = req.params.email;
  body = req.body;
  // console.log(body);
  query = { email: email };
  const update = {
    $set: body,
  };
   let data =  await User.findOneAndUpdate(query,update,{ returnNewDocument : true, new: true })
   let jsonString = {"status":1,"code":"201","message":"updateuserdetails","data":data}
 // console.log(jsonString);
    return jsonString
};
module.exports.deleteuserdetails = async (req,res) => {
  email = req.params.email;
  let data = await User.findOneAndRemove({ email: email })
  let jsonString = {"status":1,"code":"201","message":"deleteuserdetails","data":data}
// console.log(jsonString);
   return jsonString
};