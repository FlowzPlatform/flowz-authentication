const { json, send, createError } = require('micro');
const microAuthGithub = require('microauth-github');
const authGit = require('./authentication');
const redirect = require('micro-redirect')
const index = require('../../index')
 const User = require('../models/user');
/*
const { gitclientId,gitclientSecret,gitcallbackUrl,gitpath,gitscope } = require('../social-config');


const options = {
  clientId: gitclientId,
  clientSecret: gitclientSecret,
  callbackUrl: gitcallbackUrl,
  path: gitpath,
  scope: gitscope
};
*/
const githubAuth = microAuthGithub(index.options);

module.exports.github = githubAuth(async (req, res, auth) => {
  let id = auth.result.info.id
   let provider = auth.result.provider
   let fullname = auth.result.info.name
   let access_token = auth.result.accessToken
   let data_length = await User.find({userid: id});
   if(data_length.length !== 0){
     throw createError(401, 'user already exist');
   }else{
     let user = new User({ aboutme:null, fullname:fullname, firstname:null, lastname:null, email:null, password:null, dob:null, role:null,signup_type:null,image_name:null,image_url:null,forget_token_created_at:null,provider:provider,access_token:access_token, userid : id});
     user = user.save();
     console.log(auth);
     console.log("Access_Token " + access_token)
   }
  if (!auth) {
    return send(res, 404, 'Not Found');
  }

  if (auth.err) {
    // Error handler
    return send(res, 403, 'Forbidden');
  }

    token = authGit.sociallogin(auth);
    console.log("token" + token.token);
    const statusCode = 302
    const location = index.redirect_app_url+'?token='+token.token
    console.log(location);
    redirect(res, statusCode, location)

//send(res, 200, authGit.sociallogin(auth));

});
