const User = require('../models/user');
const { hashSync } = require('bcrypt');
const { json, send, createError } = require('micro');
const Promise = require('promise');

module.exports.list = async () => {
  return await User.find();
};


const signup = ({ username, password, email, fullname }) =>
{
  /*
 return User.find({ username: username }).exec().then((users, err) => {
     if (!users.length) {
         let user = new User({ username: username, password: hashSync(password, 2), email:email, fullname:fullname  });
         return user.save();
     }else{
       throw createError(401, 'That user already exist');
     }
 })
*/

return getUsername(username).then((res) =>{
   console.log(res);
   return getEmail(email);
 }).then((res)=>{
   let user = new User({ username: username, password: hashSync(password, 2), email:email, fullname:fullname  });
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
