const { json, send, createError, sendError } = require('micro');
const { compareSync, hash } = require('bcrypt');
const { sign, verify } = require('jsonwebtoken');
const users = require('../services/user.service');
let mongoose = require('mongoose');
const assert = require('assert');
let responce = require('../services/responce.js');
let config = require('yaml-config');

const { secret } = require('../config');
const User = require('../models/user');



/**
* Attempt to authenticate a user.
*/
const attempt = (email, password) => {
  return User.find({ email: email }).exec().then((users, err) => {
    if (!users.length) {
       return {id:201}
    }
    const user = users[0];
    if (!compareSync(password, user.password)) {
      return {id:201}
    }
    // console.log("userllll",user);
    return user;
  });
};

/**
* Authenticate a user and generate a JWT if successful.
*/
const auth = ({ email, password }) =>
attempt(email, password).then(({ id }) => {
  if(parseInt(id) != 201) {
    id2 = {
      "userId": id,
      "iat": Math.floor(Date.now() / 1000) - 30,
      "exp": Math.floor(Date.now() / 1000) + (60 * 60),
      "aud": "https://yourdomain.com",
      "iss": "feathers",
      "sub": "anonymous"
    }
    let token = sign(id2, secret);
    let jsonObj = { token  };
    let logintoken = jsonObj.token;
    let sucessReply = sendSuccessResponce(1,'200','you are successfully login...',logintoken);
    return sucessReply;
  } else {
    let rejectReply = sendRejectResponce(0,'401','you entered wrong credential..');
    return rejectReply;
  }
});

// try {
//   let decoded =verify(token, secret);
//   // console.log(decoded);
// } catch(err) {
//   var jsonString = {"status":0,"code":"401","message":"error"}
// // console.log(jsonString);
// return jsonString;
// }

const decode = token => verify(token, secret);
module.exports.login = async (req, res) => await auth(await json(req));
module.exports.decode = (req, res) => decode(req.headers['authorization']);


const sociallogin = (req) => {
  id = req.result.info.id;

  let token = sign(id, secret);
  return { token: token };

}

module.exports.sociallogin = sociallogin
module.exports.userdetails = async(req,res) => {
  console.log("userdetails called..............................");
  let data;
  data = verify(req.headers['authorization'], secret);
  return User.find({ _id: data.userId }).exec().then((users, err) => {
    if (!users.length) {
       throw createError(401, 'That user does not exist');
    }
    const data = users[0];
    console.log(data);
    let jsonString = {"status":1,"code":"201","message":"userdetails","data":data}
// console.log(jsonString);
     return jsonString

  });
}

module.exports.updateuser = async(req,res) => {
  console.log("updateuser called..............................");
  let data;
  data = verify(req.headers['authorization'], secret);
  return User.find({ _id: data.userId }).exec().then((users, err) => {
    if (!users.length) {

    }
    const data = users[0];
    // console.log(data);
    var jsonString = {"status":1,"code":"201","message":"userdetails","data":data}
console.log(jsonString);
return jsonString;

  });
}





function sendRejectResponce(status,code,message) {
  return new responce(status,code,message);
}
function sendSuccessResponce(status,code,message,logintoken){
  return new responce(status,code,message,logintoken);
}
