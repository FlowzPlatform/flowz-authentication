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

  let data_length = await User.find({userid: id});
  console.log(data_length.length );
  //

  if (!auth) {
    return send(res, 404, 'Not Found');
  }

  if (auth.err){
    // Error handler
    //fail url
    return send(res, 403, 'Forbidden');
  }

  token = authGoogle.sociallogin(auth);


  const logintoken  = token.token;
  if( data_length.length == 0){

    let user = new User({ aboutme:null, fullname:fullname, firstname:firstname, lastname:lastname, email:null, password:null, dob:null, role:null,signup_type:null,image_name:null,image_url:picture,forget_token_created_at:null,provider:provider,access_token:access_token, userid : id, social_logintoken:logintoken,isEmailConfirm:0 });
    user = user.save();
    const statusCode = 302
    const location = index.redirect_app_url+'?id='+id
    // console.log(location);
    redirect(res, statusCode, location)
    //send(res, 200, authGit.sociallogin(auth));
  }else if(data_length.length !== 0){

    query = { userid: id }
    const update = {
      $set: {"social_logintoken":null,"updated_at":new Date() }
    };

    let up= await User.findOneAndUpdate(query,update,{ returnNewDocument : true , new: true })
    const statusCode = 302
    const location = index.redirect_app_url+'?token='+logintoken
    redirect(res, statusCode, location)
  }

});
