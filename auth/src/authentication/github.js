const { json, send, createError } = require('micro');
const microAuthGithub = require('microauth-github');
const authGit = require('./authentication');
const redirect = require('micro-redirect')
const index = require('../../index')

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

  if (!auth) {
    return send(res, 404, 'Not Found');
  }

  if (auth.err) {
    // Error handler
    return send(res, 403, 'Forbidden');
  }

    token = authGit.sociallogin(auth);
    console.log(token.token);
    const statusCode = 302
    const location = index.redirect_app_url+'?token='+token.token
    redirect(res, statusCode, location)
  
//send(res, 200, authGit.sociallogin(auth));

});
