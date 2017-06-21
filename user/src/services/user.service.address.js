const Addr = require('../models/address');

module.exports.useraddress = async (req,res) => {
  userid = req.params.uid;

  try {
      let data =  await Addr.find({ userid: userid });
      let jsonString = {"status":1,"code":201,"message":"Address","Data":data}
    return jsonString
  } catch (err) {
    let jsonString = {"status":0,"code":400,"message":"Error!"}
    return jsonString
  }
};

module.exports.updateaddress = async (req,res) => {
  userid = req.params.uid;
  body = req.body;
  query = { userid: userid };
  const update = {
    $set: body,
  };

  try {
      return await Addr.findOneAndUpdate(query,update,{ returnNewDocument : true })
  } catch (err) {
    let jsonString = {"status":0,"code":400,"message":"Error!"}
    return jsonString
  }
};




