const { json, send, createError } = require('micro');
const microAuthFacebook  = require('microauth-facebook');
const authFb = require('./authentication');
const redirect = require('micro-redirect')
const index = require('../../index')

const facebookAuth = microAuthFacebook(index.options);

module.exports.facebook = facebookAuth(async (req, res, auth) => {
  // var auth_data = auth;
  //   let user = new User({title: auth_data});
  //   user = user.save();

  if (!auth) {
    return send(res, 404, 'Not Found');
  }

  if (auth.err) {
    // Error handler
    return send(res, 403, 'Forbidden');
  }

  token = authFb.sociallogin(auth);
  const statusCode = 302
  const location = index.redirect_app_url+'?token='+token.token
  redirect(res, statusCode, location)

});
