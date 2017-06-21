const Pinfo = require('../models/user');

module.exports.userdetails = async (req,res) => {
  userid = req.params.uid;
  try {
    let data = await Pinfo.find({ userid: userid })
    let jsonString = {"status":1,"code":201,"message":"UserData","Data":data}
    return jsonString
  } catch (err) {
    let jsonString = {"status":0,"code":400,"message":"Error!"}
    return jsonString
  }  
};

module.exports.updatedetails = async (req,res) => {
  userid = req.params.uid;
  body = req.body;
  query = { userid: userid };
  const update = {
    $set: body,
  };
  try {
    let data = await Pinfo.findOneAndUpdate(query,update,{ returnNewDocument : true })
    let jsonString = {"status":1,"code":201,"message":"Personal Details Updated","Data":data}
    return jsonString
  } catch (err) {
    let jsonString = {"status":0,"code":400,"message":"Error!"}
    return jsonString
  }
};


