const { json, send, createError } = require('micro');
const microAuthTwitter = require('microauth-twitter');
const authTwitter = require('./authentication');
const redirect = require('micro-redirect')
const index = require('../../index')

const { twitconsumerKey,twitconsumerSecret,twitcallbackUrl,twitpath } = require('../social-config');

const options = {
  consumerKey: twitconsumerKey,
  consumerSecret: twitconsumerSecret,
  callbackUrl: "http://localhost:3000/auth/twitter/callback",
  path: twitpath
};

const twitterAuth = microAuthTwitter(options);

module.exports.twitter = twitterAuth( async (req, res, auth) => {

  if (!auth) {
    return send(res, 404, 'Not Found');
  }

  if (auth.err) {
    // Error handler
    return send(res, 403, 'Forbidden');
  }
  token = authTwitter.sociallogin(auth);
  const statusCode = 302
  const location = index.redirect_app_url+'?token='+token.token
  redirect(res, statusCode, location)
  //send(res, 200, authTwitter.sociallogin(auth));

});
