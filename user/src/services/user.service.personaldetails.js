const Pinfo = require('../models/personalinfo');

module.exports.userdetails = async (req,res) => {
  userid = req.params.uid;
  try {
    let data = await Pinfo.find({ userid: userid })
    if (data != '') {
        let response = {"status":1,"code":201,"message":"User details","Data":data}
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

module.exports.updatedetails = async (req,res) => {
  userid = req.params.uid;
  body = req.body;
  query = { userid: userid };
  const update = {
    $set: body,
  };
  try {
    let data = await Pinfo.findOneAndUpdate(query,update,{ returnNewDocument : true })
    if (data != '') {
        let response = {"status":1,"code":201,"message":"Update User details","Data":data}
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


