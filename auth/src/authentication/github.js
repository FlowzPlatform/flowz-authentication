const { json, send, createError } = require('micro');
const microAuthGithub = require('microauth-github');
const authGit = require('./authentication');
const redirect = require('micro-redirect')
const index = require('../../index')
const User = require('../models/user');
const githubAuth = microAuthGithub(index.options);

module.exports.github = githubAuth(async (req, res, auth) => {
  let id = auth.result.info.id
   let provider = auth.result.provider
   let fullname = auth.result.info.name
   let access_token = auth.result.accessToken

    let data_length = await User.find({ social_uid: id });
    let data = data_length[0];


     if (!auth) {
       return send(res, 404, 'Not Found');
     }

     if (auth.err){
       // Error handler
       //fail url
       return send(res, 403, 'Forbidden');
     }

   // console.log("googletoken",token);
     if( data_length.length == 0){
       let user = new User({ aboutme:null, fullname:fullname, firstname:null, lastname:null, email:null, password:null, dob:null, role:null,signup_type:null,image_name:null,image_url:null,forget_token_created_at:null,provider:provider,access_token:access_token,isEmailConfirm:0,social_uid:id});
         user.save(function(err){
           if(err)
           {
             console.log(err);
           }
           else{
             //console.log(user._id);
             let ob_id = user._id;
             const statusCode = 302
             const location = index.redirect_app_url+'?ob_id='+ob_id
             redirect(res, statusCode, location)
           }
         });
       }else if(data.isEmailConfirm == 1){
         let ob_id = data._id;
         token = authGit.sociallogin(ob_id);
         const logintoken  = token.logintoken;
         const statusCode = 302
         const location = index.redirect_app_url+'?token='+logintoken
         redirect(res, statusCode, location)
       }else{
         let ob_id = data._id;
         const statusCode = 302
         const location = index.redirect_app_url+'?ob_id='+ob_id
         redirect(res, statusCode, location)
       }

});
