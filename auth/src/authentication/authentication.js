const { json, send, createError, sendError } = require('micro');
const { compareSync, hash } = require('bcrypt');
const { sign, verify } = require('jsonwebtoken');
const { hashSync } = require('bcrypt');
var bcrypt = require('bcrypt');
const users = require('../services/user.service');
let mongoose = require('mongoose');
const assert = require('assert');
let responce = require('../services/responce.js');
let config = require('../services/config.yaml');

const { secret } = require('../config');
var ldapConfig = require('../config.js');
// console.log("ldapConfig",ldapConfig)


const User = require('../models/user');
var ldap = require('ldapjs');
var client = ldap.createClient({
  url: ldapConfig.ldapUrl
});
// console.log(client)
let logintoken;
let id;

/**
* Attempt to authenticate a user.
*/
const attempt = (email, password) => {
  return User.find({ email: email }).exec().then((users, err) => {
    if (!users.length) {
      throw createError(401, 'That user does not exist');
    }
    const user = users[0];
    if (!compareSync(password, user.password)) {
      throw createError(401, "password doesn't match");
    }
    return user;
  });
};

let loginprocess = function (id) {
  console.log("id", id)
  try {
    payload = {
      "userId": id,
      "iat": Math.floor(Date.now() / 1000) - 30,
      "exp": Math.floor(Date.now() / 1000) + (60 * 60),
      "aud": "https://yourdomain.com",
      "iss": "feathers",
      "sub": "anonymous"
    }
    console.log("payload", payload)
    let token = sign(payload, secret);
    console.log("token", token)
    return { "status": 1, "code": "201", "message": "login succesfully", logintoken: token };
  } catch (err) {
    throw createError(401, 'wrong credential');
  }
}


/**
* Authenticate a user and generate a JWT if successful.
*/
const auth = ({ email, password }) =>
  attempt(email, password).then(({ id }) => {
    // console.log('auth_id:', id);
    // console.log('email:',email);
    // console.log('password:',password);
    return loginprocess(id);
  });

const decode = token => verify(token, secret);
module.exports.login = async (req, res) => await auth(await json(req));
module.exports.decode = (req, res) => decode(req.headers['authorization']);

const sociallogin = (id) => {
  // console.log('social_id:',id);
  return loginprocess(id);
};

module.exports.sociallogin = sociallogin

module.exports.userdetails = async (req, res) => {
  console.log("hello")
  let token = req.headers['authorization'];
  try {
    let data;
    data = verify(req.headers['authorization'], secret);
    return User.find({ _id: data.userId }).exec().then((users, err) => {
      if (!users.length) {
        throw createError(401, 'That user does not exist');
      }
      const data = users[0];
      let jsonString = { "status": 1, "code": "201", "message": "userdetails", "data": data }
      return jsonString

    });
  } catch (err) {
    // err
    throw createError(401, 'invalid token');
  }
}

module.exports.googleauthprocess = async (req, res) => {
  req = await json(req)
  let aboutme = req.aboutme;
  let email = req.email;
  let ob_id = req.id;
  // console.log(ob_id);
  let users = await User.find({ _id: ob_id });
  // console.log(users);
  let data = users[0];
  // console.log("data:",data);

  if (users.length == 0) {
    throw createError(401, 'user not exist');
  } else {
    // console.log("data:",data);
    let emailCheck = await User.find({ email: email });
    if (emailCheck.length != 0) {
      throw createError(409, 'Email already exist');
    }
    query = { _id: ob_id }
    const update = {
      $set: { "aboutme": aboutme, "email": email, "isEmailConfirm": 1, "updated_at": new Date() }
    };

    let up = await User.findOneAndUpdate(query, update, { returnNewDocument: true, new: true })
    const id = up._id;
    return loginprocess(id);
  }
}



var self = {

  ldapbind: async (strBindDn, strPass) => {
    let isAuth = false;
    return new Promise((resolve, reject) => {
      client.bind(strBindDn, strPass, function (err) {
        //assert.ifError(err);
        if (!err) {
          isAuth = true;
        }
        console.log(err);
        resolve({ 'auth': isAuth });
      });
    });
  },

  ldapsearch: async (strDn, options) => {

    let searchData = [];
    return new Promise((resolve, reject) => {

      client.search(strDn, options, function (err, res) {
        //assert.ifError(err);
        console.log(err);

        res.on('searchEntry', function (entry) {
          console.log('entry: ' + JSON.stringify(entry.object));
          searchData.push(entry.object)
          // resolve({ 'event': 'searchEntry', 'response': entry.object });
        });
        res.on('searchReference', function (referral) {
          console.log('referral: ' + referral.uris.join());
          //resolve({'event':'searchReference','reponse':referral.uris.join()});
        });
        res.on('error', function (err) {
          console.error('error: ' + err.message);
          resolve({});
          //resolve({'event':'error','reponse':err.message});
        });
        res.on('end', function (result) {
          console.log('status: ' + result.status);
          resolve({ 'response': searchData });
        });
      });
    });

  }
}


module.exports.ldapauthprocess = async (req, res) => {
  try {
    const body = await json(req)
    console.log(body.userid)
    //  console.log("admin dn :: " + ldapConfig.adminDn);
    //  console.log("admin pass :: " + ldapConfig.adminPass);
    var isAdminAuth = isUserAuth = false;
    isAdminAuth = await self.ldapbind(ldapConfig.adminDn, ldapConfig.adminPass);

    console.log("admin auth :: " + isAdminAuth.auth);

    if (isAdminAuth.auth) {
      //  admin is authenticated, search for given user
      var searchOptions = {
        filter: '(uid=' + body.userid + ')',
        //filter: '(cn=*)',
        scope: 'sub'
        //attributes: ['dn', 'sn', 'cn']
      };
      var strDn = 'ou=users,' + ldapConfig.ldapDc;
      var result = await self.ldapsearch(strDn, searchOptions);

      console.log('==================================');
      if (result.response.length) {
        console.log(result.response[0]);

        let UserDn = result.response[0].dn;
        let controls = result.response[0].controls;
        let cn = result.response[0].cn;
        let givenName = result.response[0].givenName;
        let gidNumber = result.response[0].gidNumber;
        let homeDirectory = result.response[0].homeDirectory;
        let sn = result.response[0].sn;
        let objectClass = result.response[0].objectClass;
        let userPassword = result.response[0].userPassword;
        let uidNumber = result.response[0].uidNumber;
        let uid = result.response[0].uid;

        console.log("UserDn=" + UserDn)
        console.log("controls=" + controls)
        console.log("cn=" + cn)
        console.log("givenName=" + givenName)
        console.log("gidNumber=" + gidNumber)
        console.log("homeDirectory=" + homeDirectory)
        console.log("sn=" + sn)
        console.log("objectClass=" + objectClass)
        console.log("userPassword=" + userPassword)
        console.log("uidNumber=" + uidNumber)
        console.log("uid=" + uid)


        isUserAuth = await self.ldapbind(UserDn, body.passwd);


        if (isUserAuth.auth) {
          console.log("fetch user groups ::::::::::: ");
          ///var userAssignedRoles = await self.userroles(body.userid);

          let data_length = await User.find({ email: uid });
          let data = data_length[0];

          var userData = {
            'authenticated': true,
            'uid': data._id,
            ///'roles': userAssignedRoles
          }

          var token = loginprocess(userData.uid)

          // var authRes = { token };

          if (data_length.length == 0) {
            let user = new User({ aboutme: null, fullname: cn, firstname: givenName, lastname: sn, email: uid, password: userPassword, dob: null, role: null, signup_type: null, image_name: null, image_url: null, forget_token_created_at: null, provider: "ldap", access_token: null, isEmailConfirm: 0, social_uid: null });
            user.save(function (err) {
              if (err) {
                throw createError(401, 'data insertaion failure');
              }
            })

            var userData = {
              'authenticated': true,
              'uid': data._id,
              ///'roles': userAssignedRoles
            }

            var token = loginprocess(userData.uid)
            send(res, 200, token);
            return;
          } else {
            var userData = {
              'authenticated': true,
              'uid': data._id,
              ///'roles': userAssignedRoles
            }

            var token = loginprocess(userData.uid)
            send(res, 200, token);
            return;

          }


          //return isUserAuth;
        } else {
          send(res, 404, { 'status': 0, 'code': 404, 'message': 'authentication failed', 'error': 'invalid credentials' });
          return;
        }
      } else {
        send(res, 404, { 'status': 0, 'code': 404, 'message': 'authentication failed', 'error': 'invalid credentials' });
        return;
      }
    }

    send(res, 404, { 'auth': false });

  } catch (err) {
    console.log(err);
    send(res, 403, { 'auth': false, 'error': err });
    //throw createError(403, 'error!');
  }

  return;
}

module.exports.changepassword = async (req, res) => {
  let token = req.headers['authorization'];
  req = await json(req)
  let oldpass = req.oldpass;
  let newpass = req.newpass;
  try {
    let data = verify(token, secret);
    let users = await User.find({ _id: data.userId });
    if (!users.length) {
      throw createError(401, 'That user does not exist');
    }
    let comparepass = await bcrypt.compare(oldpass, users[0].password);
    if (comparepass == false) {
      throw createError(401, 'password does not match');
    } else {
      query = { _id: data.userId };
      const update = { $set: { "password": hashSync(newpass, 2), "updated_at": new Date() } };
      let up = await User.findOneAndUpdate(query, update, { returnNewDocument: true, new: true })
      let jsonString = { "status": 1, "code": "201", "message": "change password successfully" }
      return jsonString
    }
  } catch (err) {
    throw createError(401, 'invalid token');
  }
};

function sendRejectResponce(status, code, message) {
  return new responce(status, code, message);
}
function sendSuccessResponce(status, code, message, logintoken) {
  return new responce(status, code, message, logintoken);
}
