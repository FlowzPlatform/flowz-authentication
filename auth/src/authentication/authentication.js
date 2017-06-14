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


const sendingres = async (request, response) => {
  const data = await json(request)
  send(response, 200, 'hello world ')
}
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
    // console.log(JSON.stringify(jsonObj.token));
let logintoken = jsonObj.token;
// console.log(logintoken);
    // return { token: token  };
     let sucessReply = sendSuccessResponce('1','200','you are successfully login...',logintoken);
     return sucessReply;
} else {
  let rejectReply = sendRejectResponce('0','401','you entered wrong credential..');
  return rejectReply;
}
});

const decode = token => verify(token, secret);

module.exports.login = async (req, res) => await auth(await json(req));

module.exports.decode = (req, res) => decode(req.headers['authorization']);


const sociallogin = (req) => {
  id = req.result.info.id;

  let token = sign(id, secret);
  return { token: token };

}

module.exports.sociallogin = sociallogin
module.exports.me = async(req) => {
  let data;
  data = verify(req.headers['authorization'], secret);

  return User.find({ _id: data.userId }).exec().then((users, err) => {
    if (!users.length) {
      throw createError(401, 'That user does not exist');
    }

    const user = users[0];

    return user;
  });
}

function sendRejectResponce(status,code,message) {
  return new responce(status,code,message);
}
function sendSuccessResponce(status,code,message,logintoken){
  return new responce(status,code,message,logintoken);

}
