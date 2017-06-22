const Addr = require('../models/address');

module.exports.useraddress = async (req,res) => {
  userid = req.params.uid;

  try {
      let data =  await Addr.find({ userid: userid });
      if (data != '') {
        let response = {"status":1,"code":201,"message":"Address","Data":data}
        return response
      } else{
        let response = {"status":0,"code":404,"message":"Data not found"}
        return response
      }
  } catch (err) {
    let response = {"status":0,"code":400,"message":"Error!"}
    return response
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
    let data = await Addr.findOneAndUpdate(query,update,{ returnNewDocument : true })
    if (data != '') {
        let response = {"status":1,"code":201,"message":"Address is updated","Data":data}
        return response
      } else{
        let response = {"status":0,"code":404,"message":"Data not found"}
        return response
      }
  } catch (err) {
    let response = {"status":0,"code":400,"message":"Error!"}
    return response
  }
};







