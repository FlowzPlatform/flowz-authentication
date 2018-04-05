const User = require('../models/user');
const { hashSync } = require('bcrypt');
const { json, send, createError, } = require('micro');
const Promise = require('promise');
const crypto = require('crypto');
let responce = require('./responce');
let config = require('yaml-config');
let settings = config.readConfig('src/services/config.yaml');
const emailjs = require("emailjs");
const { sendemailurl, secret } = require('../config');
const rp = require('request-promise');
var randomstring = require("randomstring");
var url = require('url');
const redirect = require('micro-redirect')

module.exports.list = async () => {
  return await User.find();
};

///////////////////////////////
// 
// signup function
// input-type: Object
// required fields: [email, password]
//
///////////////////////////////

const signup = (req, { username, aboutme, fullname, firstname, lastname, middlename, companyname, address1, address2, email, country, state, city, zipcode, phonenumber, fax, password, dob, role, signup_type, image_name, image_url, provider, access_token, picture, isActive, isEmailVerified, url }) => {
  console.log("req....",req);
  return getEmail(email).then((res) => {
    console.log("email res...", res)
    var uniqueHash = generateToken();
    return uniqueHash.then((uniqueHash) => {
      let user = new User({ username: username, aboutme: aboutme, fullname: fullname, firstname: firstname, lastname: lastname, middlename: middlename, companyname: companyname, address1: address1, address2: address2, country: country, state: state, city: city, zipcode: zipcode, phonenumber: phonenumber, fax: fax, email: email, password: hashSync(password, 2), dob: dob, role: role, signup_type: signup_type, image_name: image_name, image_url: image_url, forget_token_created_at: null, provider: null, access_token: null, picture: null, isActive: 1, veri_token: uniqueHash, isEmailVerified: 0 });
      user = user.save();
      return user.then((userdata) => {
        console.log("req.headers.referer",req.headers.referer)
        let url = req.headers['x-forwarded-proto'] + "://" + req.headers['x-forwarded-host']
        let referer = req.headers.referer;
        console.log("url",url);
        console.log("referer",referer);
        let to = userdata.email;
        let newToken = userdata.veri_token;
        let sendemail = verifyUserEmail(to, newToken, url, referer)
        return sendemail.then((res) => {
          if(res.success === undefined){
             throw createError(500, "email sending error");
          }else{
            let sucessReply = sendSuccessResponce(1, '200', 'You are successfully register.Please verify your email');
            return sucessReply;
          }
        })
      })
    })
  }).catch((err) => {
    throw createError(409, 'email already exists');
  })
}

module.exports.setup = async (req, res) => await signup(req, await json(req));

/**
 * username validation
 */

let getUsername = function (username) {
  promise = new Promise(function (resolve, reject) {
    User.find({ username: username }).exec().then((users, err) => {
      if (users.length) {
        reject('That username already exist');
      } else {
        resolve('not exist')
      }
    })
  })

  return promise;
}

/**
 * getEmail validation
 */

let getEmail = function (email) {
  promise = new Promise(function (resolve, reject) {
    User.find({ email: email }).exec().then((users, err) => {
      if (users.length) {
        reject('That email already exist');
      } else {
        resolve('not exist')
      }
    })
  })

  return promise;
}


/**
 *  verification of user email route
 */

module.exports.verifyemail = async (req, res) => {
  try {
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;
    let queryToken = query.token;
    let referer = query.redirect;
    let users = await User.find({ veri_token: queryToken });
    let data = users[0];

    if (users.length == 0) {
      throw createError(401, 'user not exist');
    } else {
      query = { email: data.email }
      const update = {
        $set: { "veri_token": null, "isActive": 1, "isEmailVerified": 1, "updated_at": new Date() }
      };

      let up = await User.findOneAndUpdate(query, update, { returnNewDocument: true, new: true })
      let location = referer
      redirect(res, 302, location)
      // let sucessReply = sendSuccessResponce(1, '200', 'email verified succesfully');
      // return sucessReply;
    }
  } catch (err) {
    let referer = query.redirect;
    redirect(res, 302, referer)
}
}

/**
 * sendemail for verification of user email
 */

let verifyUserEmail = async function (to, newToken, url, referer) {
  console.log("to",to);
   console.log("newToken",newToken);
    console.log("url",url);
     console.log("referer",referer);
  var token = encodeURIComponent(newToken);
  let verifiedurl = url + "/auth/api/verifyemail?token=" + token + "&redirect=" +  referer
  console.log("verifiedurl",verifiedurl)
  let body = "<html><body>Hello Dear, <br><br>Welcome to FlowzDigital.Please verify your email by click below button.<br><br>" +
    `<table>
    <tr>
        <td style="background-color: #0097c3;border-color: #00aac3 ;border: 1px solid #00aac3 !important;padding: 10px;text-align: center,border-radius:1px;">
            <a style="display: block;color: #ffffff !important;padding: 10px;background-color: #0097c3;font-size: 12px;text-decoration: none;text-transform: uppercase;" href=` + verifiedurl + `>
                Verify Email
            </a>
        </td>
    </tr>
  </table>`+
  "<br><br>Sincerly Yours, <br>FlowzDigital Team <br><br><body></html>"

  var data = {
    "to": to,
    "from": "noreply@flowz.com",
    "subject": "verify your email",
    "body": body
  }


  var options = {
    method: 'POST',
    url: sendemailurl,
    headers:
    {
      'cache-control': 'no-cache',
      'content-type': 'application/json'
    },
    body: data,
    json: true
  };

  const mailres = await rp(options)

  return mailres

}

/**
 * sendemail for forgetpassword
 */

let sendemail = async function (to, newToken, url) {
  var token = encodeURIComponent(newToken);
  let link = url
  let resetlink = link + "?forget_token=" + token
  let body = "<html><body>Hello Dear, <br><br>You have requested to reset your password.Please click below button and set your new password. <br><br>" +
    `<table>
    <tr>
        <td style="background-color: #0097c3;border-color: #00aac3 ;border: 1px solid #00aac3 !important;padding: 10px;text-align: center,border-radius:1px;">
            <a style="display: block;color: #ffffff !important;padding: 10px;background-color: #0097c3;font-size: 12px;text-decoration: none;text-transform: uppercase;" href=` + resetlink + `>
                reset password
            </a>
        </td>
    </tr>
    </table>` +
    "<br><p>If you did not request a password reset please ignore this email.This password reset is only valid for next 24 hour.</p><br>Sincerly Yours, <br>FlowzDigital Team <br><br><body></html>"

  var data = {
    "to": to,
    "from": "noreply@flowz.com",
    "subject": "reset your password",
    "body": body
  }


  var options = {
    method: 'POST',
    url: sendemailurl,
    headers:
    {
      'cache-control': 'no-cache',
      'content-type': 'application/json'
    },
    body: data,
    json: true
  };

  const mailres = await rp(options)

}

/**
 * sendemail for dashboardpassword
 */

let senddashboardpass = async function (email, password) {

  let body = '<html><body>hello,<br><br>Thanks for register with flowzdigital service.your password for flowzdashboard is given below.' +
    '<br><br>' +
    '<table>' +
    '<tr>' +
    '<td style="color: white !important;background-color: #0097c3 !important;border-color: #00aac3 !important;border: 1px solid #00aac3 !important;padding: 10px !important;text-align: center !important;border-radius:1px !important;">' +
    password +
    '</td>' +
    '</tr>' +
    '</table>' +
    '</p><br>Sincerly Yours, <br>FlowzDigital Team <br><br><body></html>'


  var data = {
    "to": email,
    "from": "noreply@flowz.com",
    "subject": "flowzdashboard password",
    "body": body
  }


  var options = {
    method: 'POST',
    url: sendemailurl,
    headers:
    {
      'cache-control': 'no-cache',
      'content-type': 'application/json'
    },
    body: data,
    json: true
  };

  const mailres = await rp(options)
}

/**
 * sendemail api func.
 */

module.exports.sendemailapi = async (req, res) => {
  try {
    req = await json(req)

    let server2 = emailjs.server.connect({
      host: req.host,
      user: req.user,
      password: req.password,
      ssl: true
    });
    let message = {
      text: req.text,
      from: req.from,
      to: req.to,
      cc: req.cc,
      subject: req.subject,
      attachment:
      [
        { data: "<html>" + req.body + "</html>", alternative: true },
        { path: req.path, type: req.type, name: req.name }
      ]
    };
    const send = await server2.send(message);
    let sucessReply = sendSuccessResponce(1, '201', 'email succesfully send');
    return sucessReply;
  } catch (err) {
    throw createError(500, "email sending error");
  }
}

/**
 * forgetpassword 
 */

module.exports.forgetpassword = async (req, res) => {
  let logintoken = req.headers['authorization'];
  req = await json(req)
  let to = req.email;
  let url = req.url;
  if (to == "" || to == null) {
    throw createError(401, 'please enter email');
  } else if (url == "" || url == null) {
    throw createError(401, 'please enter reset url');
  }
  let users = await User.find({ email: to });
  if (users.length === 0) {
    throw createError(401, 'please enter correct email');
  } else {
    const newToken = await generateToken();
    let arr = [];
    let o = {};
    o.token = newToken;
    arr.push(o);
    query = { email: to };
    const update = { $set: { "forget_token": newToken, "forget_token_created_at": new Date() } };
    await User.findOneAndUpdate(query, update, { returnNewDocument: true, new: true })
    try {
      await sendemail(to, newToken, url)
      let sucessReply = sendSuccessResponce(1, '200', 'your request for forgetpassword sent to your email');
      return sucessReply;
    } catch (err) {
      throw createError(401, err)
    }
  }
};

/**
 * resetpassword 
 */

module.exports.resetpassword = async (req, res) => {
  req = await json(req)
  let password = req.new_password;
  let token = req.token;
  if (token == "" || token == null) {
    throw createError(401, 'invalid token...');
  }
  let users = await User.find({ forget_token: token });

  if (users.length === 0) {
    throw createError(401, 'invalid token...');
  } else {
    let date1 = new Date(users[0].forget_token_created_at);
    let date2 = new Date();
    let timeDiff = Math.abs(date2 - date1) / (60 * 60 * 1000);
    if (timeDiff < 1) {
      query = { forget_token: token }
      const update = {
        $set: { "password": hashSync(password, 2), "updated_at": new Date(), forget_token: null }
      };
      await User.findOneAndUpdate(query, update, { returnNewDocument: true, new: true })
      let sucessReply = sendSuccessResponce(1, '200', 'successfully resetpassword...');
      return sucessReply;
    }
    else {
      throw createError(401, 'invalid token');
    }
  }
};

/**
 * forgetpassword token generation
 */

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

/**
 * send dashboardpassword
 */


module.exports.dashboardpass = async (req, res) => {
  req = await json(req)
  let firstname = req.firstname;
  let lastname = req.lastname;
  let email = req.email;
  let password = randomstring.generate(12);
  let signData = {
    firstname: firstname,
    lastname: lastname,
    email: email,
    password: password
  }
  await signup(signData)
  try {
    await senddashboardpass(email, password)
    let sucessReply = sendSuccessResponce(1, '200', 'password succesfully sent to your email');
    return sucessReply;
  } catch (err) {
    throw createError(401, err)
  }
}

function sendRejectResponce(status, code, message) {
  return new responce(status, code, message);
}
function sendSuccessResponce(status, code, message, logintoken) {
  return new responce(status, code, message, logintoken);
}
