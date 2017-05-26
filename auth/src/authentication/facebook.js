const { json, send, createError } = require('micro');
const microAuthFacebook  = require('microauth-facebook');
const authFb = require('./authentication');
const index = require('../../index')

/*
const { fbappId,fbappSecret,fbcallbackUrl,fbpath,fbscope } = require('../social-config');

const options = {
  appId: fbappId,
  appSecret: fbappSecret,
  callbackUrl: fbcallbackUrl,
  path: fbpath,
  fields: fbscope
};
*/
const facebookAuth = microAuthFacebook(index.options);

module.exports.facebook = facebookAuth(async (req, res, auth) => {

  if (!auth) {
    return send(res, 404, 'Not Found');
  }

  if (auth.err) {
    // Error handler
    return send(res, 403, 'Forbidden');
  }

  send(res, 200, authFb.sociallogin(auth));

});
