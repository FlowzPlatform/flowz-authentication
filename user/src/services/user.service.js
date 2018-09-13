const { json, send, createError, sendError } = require('micro');
const User = require('../models/user');
let responce = require('./responce');
let config = require('../config.js');

const io = require('socket.io')(config.socketPort);
io.on('connection', socket => {});

module.exports.alluserdetails = async () => {
  try {
    let data = await User.find()
    if (data != null) {
      let sucessReply = sendSuccessResponce(1, '201', 'alluserdetails', data);
      return sucessReply;
    } else {
      let rejectReply = sendRejectResponce(0, '404', 'data not found');
      return rejectReply;
    }
  } catch (err) {
    throw createError(403, 'error!');
  }
};

module.exports.getuserdetails = async (req, res) => {
  uid = req.params.uid;
  try {
    let data = await User.find({ _id: uid })
    if (data != null) {
      let sucessReply = sendSuccessResponce(1, '201', 'getuserdetails', data);
      return sucessReply;
    } else {
      let rejectReply = sendRejectResponce(0, '404', 'data not found');
      return rejectReply;
    }
  } catch (err) {
    throw createError(403, 'error!');
  }
};

module.exports.useroption = async (req, res) => {
  let sucessReply = sendSuccessResponce(1, '201', 'getuserdetails', 'data');
  return sucessReply;
}

module.exports.updateuserdetails = async (req, res) => {
  uid = req.params.uid;
  body = req.body;
  let email_found = body['email'];
  let password = body['password'];
  if (typeof email_found !== "undefined") {
    let rejectReply = sendRejectResponce(0, '406', 'You can not change email');
    return rejectReply;
  } else if (typeof password !== "undefined") {
    let rejectReply = sendRejectResponce(0, '406', 'You can not change password');
    return rejectReply;
  }
  query = { _id: uid };
  try {
    let data = await User.update(query, body, { upsert: true, setDefaultsOnInsert: true })
    if (data.nModified) {
      let userdata = await User.find(query)
      io.emit('updateduserdetails', userdata[0]);
      let sucessReply = sendSuccessResponce(1, '201', 'updateuserdetails', data);
      return sucessReply;
    } else {
      let rejectReply = sendRejectResponce(0, '200', 'no record updated');
      return rejectReply;
    }
  } catch (err) {
    throw createError(403, 'error!');
  }
};

module.exports.deleteuserdetails = async (req, res) => {
  uid = req.params.uid;
  try {
    let data = await User.findOneAndRemove({ _id: uid })
    if (data != null) {
      let sucessReply = sendSuccessResponce(1, '201', 'successfully deleted user details');
      return sucessReply;
    } else {
      let rejectReply = sendRejectResponce(0, '404', 'data not found');
      return rejectReply;
    }
  } catch (err) {
    throw createError(403, 'error!');
  }
};

module.exports.getspecificuserdetails = async (req, res) => {
  let ObjectID = require('mongodb').ObjectID;
  body = req.body;
  let users = body;
  var obj_ids = [];
  for (var i = 0; i < users.length; i++) {
    obj_ids.push(new ObjectID(users[i].toString()));
  }
  try {
    let data = await User.find({ _id: { $in: obj_ids } });
    if (data != null) {
      let sucessReply = sendSuccessResponce(1, '201', 'getspecificuserdetails', data);
      return sucessReply;
    } else {
      let rejectReply = sendRejectResponce(0, '404', 'data not found');
      return rejectReply;
    }
  } catch (err) {
    throw createError(403, 'error!');
  }
};

function sendRejectResponce(status, code, message) {
  return new responce(status, code, message);
}
function sendSuccessResponce(status, code, message, data) {
  return new responce(status, code, message, data);
}
