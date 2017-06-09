const User = require('../models/user');
const { hashSync } = require('bcrypt');
const { json, send, createError } = require('micro');
const Promise = require('promise');
const crypto = require('crypto');

module.exports.list = async () => {
  return await User.find();
};


const signup = ({ username, aboutme, firstname, lastname, email, password, dob, role, signup_type, image_name, image_url }) =>
{

return getUsername(username).then((res) =>{
   return getEmail(email);
 }).then((res)=>{
   let user = new User({ username:username, aboutme:aboutme, firstname:firstname, lastname:lastname, email:email, password:hashSync(password, 2) , dob:dob, role:role,signup_type:signup_type,image_name:image_name,image_url:image_url,forget_token_created_at:null  });
   return user.save();
 }).catch((err) => {
   throw createError(401, err);
 })

}


module.exports.setup = async (req, res) => await signup(await json(req));

let getUsername = function(username){
  promise =  new Promise(function(resolve,reject){
    User.find({ username: username }).exec().then((users, err) => {
      if(users.length) {
        reject('That username already exist');
      }else{
        resolve('not exist')
      }
    })
  })

  return promise;
}


let getEmail = function(email){
  promise =  new Promise(function(resolve,reject){
    User.find({ email: email }).exec().then((users, err) => {
      if(users.length) {
        reject('That email already exist');
      }else{
        resolve('not exist')
      }
    })
  })

  return promise;
}

module.exports.forgetpassword = async (req,res) => {
      req = await json(req)
      let email=req.email;
      let users = await User.find({ email: email });
      if(users.length === 0)
      {
        throw createError(401, 'please enter correct email');
      }else{
      const newToken = await generateToken();

      query = { email: email };
      const update = {
      $set: {"forget_token":newToken, "forget_token_created_at":new Date()},
    };
     return await User.findOneAndUpdate(query,update,{ returnNewDocument : true, new: true })
   }
};

module.exports.resetpassword = async (req,res) => {
  req = await json(req)
  let password=req.password;
  let token=req.token;
  if( token == "" || token == null ){
      throw createError(401, 'invalid token...');
  }
  let users = await User.find({forget_token: token});

  if(users.length === 0){
    throw createError(401, 'invalid token...');
  }else{
  let date1 = new Date(users[0].forget_token_created_at);
  let date2 = new Date();
  let timeDiff = Math.abs(date2-date1)/(60*60*1000);
  if(timeDiff<1){
    query = { forget_token: token }
    const update = {
      $set: {"password":hashSync(password, 2), "updated_at":new Date()},
    };
    return await User.findOneAndUpdate(query,update,{ returnNewDocument : true , new: true })

  }
  else {
    throw createError(401, 'your token is expired..request another..!!!');
  }
}
};

function generateToken(stringBase = 'base64') {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(48, (err, buffer) => {
      if (err) {
        reject(err);
      } else {
        resolve(buffer.toString(stringBase));
      }
    });
  });
}
