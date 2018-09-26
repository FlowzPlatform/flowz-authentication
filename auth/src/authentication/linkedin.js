const sleep = require('then-sleep')
const { json, send, createError } = require('micro');
const authLinkedin = require('./authentication');
const microAuthLinkedin = require('microauth-linkedin');
const redirect = require('micro-redirect')
const index = require('../../index')
const linkedinAuth = microAuthLinkedin(index.options);
const User = require('../models/user');

module.exports.linkedin = linkedinAuth(async (req, res, auth) => {

  let id = auth.result.info.id
  let provider = auth.result.provider
  let fullname = auth.result.info.formattedName
  let firstname = auth.result.info.firstName
  let lastname = auth.result.info.lastName
  let access_token = auth.result.access_token
  let email = auth.result.info.emailAddress
  let publicProfileUrl = auth.result.info.publicProfileUrl

  let data_length = await User.find({ social_uid: id });
  let data = data_length[0];


  if (!auth) {
    return send(res, 404, 'Not Found');
  }

  if (auth.err) {
    // Error handler
    return send(res, 403, 'Forbidden');
  }

  if (data_length.length == 0) {
    let user = new User({ aboutme: null, fullname: fullname, firstname: firstname, lastname: lastname, email: email, password: null, dob: null, role: null, signup_type: null, image_name: null, image_url: publicProfileUrl, forget_token_created_at: null, provider: provider, access_token: access_token, isEmailConfirm: 0, social_uid: id, isActive:1 });
    user.save(function (err) {
      if (err) {
        throw createError(401, 'data insertaion failure');
      }
      else {
        let ob_id = user._id;
        const statusCode = 302
        const location = index.redirect_app_url + '?ob_id=' + ob_id
        redirect(res, statusCode, location)
      }
    });
  } else if (data.isEmailConfirm == 1) {
    let ob_id = data._id;
    token = authLinkedin.sociallogin(ob_id);
    const logintoken = token.logintoken;
    const statusCode = 302
    const location = index.redirect_app_url + '?token=' + logintoken
    redirect(res, statusCode, location)
  } else {
    let ob_id = data._id;
    const statusCode = 302
    const location = index.redirect_app_url + '?ob_id=' + ob_id
    redirect(res, statusCode, location)
  }
});