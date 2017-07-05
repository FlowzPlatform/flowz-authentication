const { json, send, createError, sendError } = require('micro');
const { compareSync, hash } = require('bcrypt');
const { sign, verify } = require('jsonwebtoken');
const { hashSync} = require('bcrypt');
var bcrypt = require('bcrypt');
const users = require('../services/user.service');
let mongoose = require('mongoose');
const assert = require('assert');
let responce = require('../services/responce.js');
let config = require('../services/config.yaml');

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
    return user;
  });
};

/**
* Authenticate a user and generate a JWT if successful.
*/
const auth = ({ email, password }) =>
attempt(email, password).then(({ id }) => {
  console.log(email);
  console.log(password);
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
    throw createError(401, 'wrong credential');
  }
});

const decode = token => verify(token, secret);
module.exports.login = async (req, res) => await auth(await json(req));
module.exports.decode = (req, res) => decode(req.headers['authorization']);


const sociallogin = (req) => {
  id = req.result.info.id;

  let token = sign(id, secret);
  return { token: token };
  // console.log(token);

}

module.exports.sociallogin = sociallogin

module.exports.userdetails = async(req,res) => {
  let token = req.headers['authorization'];
  try {
    let data;
    data = verify(req.headers['authorization'], secret);
    return User.find({ _id: data.userId }).exec().then((users, err) => {
      if (!users.length) {
         throw createError(401, 'That user does not exist');
      }
      const data = users[0];
      let jsonString = {"status":1,"code":"201","message":"userdetails","data":data}
       return jsonString

    });
} catch(err) {
  // err
    throw createError(401, 'invalid token');
}
}

module.exports.changepassword = async(req,res) => {

  let token = req.headers['authorization'];
  req = await json(req)
  let oldpass=req.oldpass;
  let newpass=req.newpass;
  try{
  let data = verify(token, secret);
  let users = await User.find({_id: data.userId});
    if (!users.length) {
       throw createError(401, 'That user does not exist');
    }
    let comparepass = await bcrypt.compare(oldpass, users[0].password);
    if(comparepass == false){
      throw createError(401, 'password does not match');
    }else {
      query = { _id: data.userId };
      const update = {$set: {"password":hashSync(newpass, 2), "updated_at":new Date() }};
      let up= await User.findOneAndUpdate(query,update,{ returnNewDocument : true, new: true })
      let jsonString = {"status":1,"code":"201","message":"change password successfully"}
      return jsonString
    }
}catch(err) {
    throw createError(401, 'invalid token');
}
};

function sendRejectResponce(status,code,message) {
  return new responce(status,code,message);
}
function sendSuccessResponce(status,code,message,logintoken){
  return new responce(status,code,message,logintoken);
}
