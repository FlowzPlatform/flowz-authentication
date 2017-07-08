const microAuthGoogle = require('googleauth-micro');
const sleep = require('then-sleep')
const { json, send, createError } = require('micro');
const authGoogle = require('./authentication');
const redirect = require('micro-redirect')
const index = require('../../index')
const googleAuth = microAuthGoogle(index.options);
const User = require('../models/user');

module.exports.Gplus = googleAuth(async (req, res, auth) => {
  var id = auth.result.info.id
  var provider = auth.result.provider
  var firstname = auth.result.info.given_name
  var lastname = auth.result.info.family_name
  var picture = auth.result.info.picture
  var fullname = auth.result.info.name
  var access_token = auth.result.access_token
  // let data_length = await User.find({userid: id});
  // if(data_length.length !== 0){
  //   throw createError(401, 'user already exist');
  // }else{
    let user = new User({ aboutme:null, fullname:fullname, firstname:firstname, lastname:lastname, email:null, password:null, dob:null, role:null,signup_type:null,image_name:null,image_url:picture,forget_token_created_at:null,provider:provider,access_token:access_token, userid : id});
    user = user.save();
    console.log(auth);
    console.log("Access_Token " + access_token)

// }

  if (!auth) {
    return send(res, 404, 'Not Found');
  }

  if (auth.err){
    // Error handler
    return send(res, 403, 'Forbidden');
  }

    token = authGoogle.sociallogin(auth);
    // console.log(token.token);
    const statusCode = 302
    const location = index.redirect_app_url+'?token='+token.token
    // console.log(location);
    redirect(res, statusCode, location)

//send(res, 200, authGit.sociallogin(auth));

});
