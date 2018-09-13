const { json, send, createError } = require('micro');
const users = require('./src/services/user.service');
const db = require('./src/models/db');
const route = require('micro-route')
const auth = require('./src/authentication/authentication');
const microAuthGithub = require('microauth-github');
const parse = require('urlencoded-body-parser');
const authConfigs = require('./src/models/auth_configs');


let twitter;
let github;
let fb;
let key;
let seceret;
let Gplus;
let gpluscallbackUrl;
let gitcallbackUrl;
let fbcallbackUrl;
let twitcallbackUrl;
let linkedincallbackUrl;


const corsRoute = route('*', 'OPTIONS')
const loginRoute = route('/api/login', 'POST')
const signupRoute = route('/api/setup')
const callbacktwRoute = route('/auth/twitter/callback')
const signupGitRoute = route('/auth/github')
const callbackGitRoute = route('/auth/github/callback')
const signupFbRoute = route('/auth/facebook')
const callbackFbRoute = route('/auth/facebook/callback')
const signuptwRoute = route('/auth/twitter')
const signupGpRoute = route('/auth/Gplus')
const callbackGpRoute = route('/oauthCallback')
const signupLinkedinRoute = route('/auth/linkedin')
const callbackLinkedinRoute = route('/auth-linkedin')
const userdetailsRoute = route('/api/userdetails','GET')
const forgetpasswordRoute = route('/api/forgetpassword', 'POST')
const resetpasswordRoute = route('/api/resetpassword', 'POST')
const changepasswordRoute = route('/api/changepassword', 'POST')
const sendemailapiRoute = route('/api/sendemail', 'POST')
const verifyemailapiRoute = route('/api/verifyemail', 'GET')
const verifyaccountRoute = route('/api/verifyaccount', 'POST')
const ldapauthRoute = route('/api/ldapauth', 'POST')
const dashboardpassRoute = route('/api/dashboardpass', 'POST')
const userdetailsbyemailRoute = route('/api/userdetailsbyemail', 'POST')
const sendsmsRoute = route('/api/sendsms', 'POST')
const validateTokenRoute = route('/api/validatetoken','POST')

module.exports = async function (req, res) {

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With")

  if (corsRoute(req)) {
    // Send CORS headers
    return '';
  } else if (loginRoute(req)) {
    return auth.login(req, res);
  } else if (signupRoute(req)) {
    return users.setup(req, res);
  } else if (signupGitRoute(req)) {
    const _data = await parse(req);
    let datasearch = await authConfigs.find({ userid: "100" });
    let data = datasearch[0];
    success_url = _data.success_url;
    key = data._doc.social_configs.github.key;
    seceret = data._doc.social_configs.github.seceret;
    gitcallbackUrl = data._doc.social_configs.github.callbackUrl;
    if (success_url) {

      if (typeof success_url !== 'undefined') {
        module.exports.redirect_app_url = success_url;
      }
    }
    getGithub(req);
    return github.github(req, res);
  } else if (callbackGitRoute(req)) {
    return github.github(req, res);
  } else if (signupFbRoute(req)) {
    const _data = await parse(req);
    let datasearch = await authConfigs.find({ userid: "100" });
    let data = datasearch[0];
    success_url = _data.success_url;
    key = data._doc.social_configs.facebook.key;
    seceret = data._doc.social_configs.facebook.seceret;
    fbcallbackUrl = data._doc.social_configs.facebook.callbackUrl;
    if (success_url) {

      if (typeof success_url !== 'undefined') {
        module.exports.redirect_app_url = success_url;
      }
    }
    getFacebook(req);
    return fb.facebook(req, res);
  } else if (callbackFbRoute(req)) {
    return fb.facebook(req, res);
  } else if (signuptwRoute(req)) {
    const _data = await parse(req);
    let datasearch = await authConfigs.find({ userid: "100" });
    let data = datasearch[0];
    success_url = _data.success_url;
    key = data._doc.social_configs.twitter.key;
    seceret = data._doc.social_configs.twitter.seceret;
    twitcallbackUrl = data._doc.social_configs.twitter.callbackUrl;
    if (success_url) {

      if (typeof success_url !== 'undefined') {
        module.exports.redirect_app_url = success_url;
      }
    }
    getTwitter(req);
    return twitter.twitter(req, res);
  } else if (callbacktwRoute(req)) {
    return twitter.twitter(req, res);
  } else if (signupGpRoute(req)) {
    const _data = await parse(req);
    let datasearch = await authConfigs.find({ userid: "100" });
    let data = datasearch[0];

    success_url = _data.success_url;
    key = data._doc.social_configs.google.key;
    seceret = data._doc.social_configs.google.seceret;
    gpluscallbackUrl = data._doc.social_configs.google.callbackUrl;
    if (success_url) {

      if (typeof success_url !== 'undefined') {
      }
    }
    getGplus(req);
    return Gplus.Gplus(req, res);
  } else if (callbackGpRoute(req)) {
    return Gplus.Gplus(req, res);
  } else if (signupLinkedinRoute(req)) {
    const _data = await parse(req);
    let datasearch = await authConfigs.find({ userid: "100" });
    let data = datasearch[0];
    success_url = _data.success_url;
    key = data._doc.social_configs.linkedin.key;
    seceret = data._doc.social_configs.linkedin.seceret;
    linkedincallbackUrl = data._doc.social_configs.linkedin.callbackUrl;
    if (success_url) {

      if (typeof success_url !== 'undefined') {
        module.exports.redirect_app_url = success_url;
      }
    }
    getLinkedin(req);
    return linkedin.linkedin(req, res);
  } else if (callbackLinkedinRoute(req)) {
    return linkedin.linkedin(req, res);
  } else if (userdetailsRoute(req)) {
    return auth.userdetails(req);
  } else if (forgetpasswordRoute(req)) {
    return users.forgetpassword(req, res);
  } else if (resetpasswordRoute(req)) {
    return users.resetpassword(req, res);
  } else if (changepasswordRoute(req)) {
    return auth.changepassword(req, res);
  } else if (sendemailapiRoute(req)) {
    return users.sendemailapi(req, res);
  } else if (verifyemailapiRoute (req)) {
    return users.verifyemail(req, res);
  } else if (verifyaccountRoute(req)) {
    return users.verifyaccount(req, res);
  } else if (ldapauthRoute(req)) {
    return auth.ldapauthprocess(req, res);
  } else if (dashboardpassRoute(req)) {
    return users.dashboardpass(req, res);
  } else if (userdetailsbyemailRoute(req)) {
    return auth.userdetailsbyemail(req, res);
  } else if (sendsmsRoute(req)) {
    return users.sendsms(req, res);
  } else if(validateTokenRoute(req)) {
    return auth.validateToken(req, res);
  }

}
function getTwitter(req) {

  const options = {
    consumerKey: key,
    consumerSecret: seceret,
    callbackUrl: twitcallbackUrl,
    path: '/auth/twitter'
  };
  module.exports.options = options;
  twitter = require('./src/authentication/twitter');

}

function getGithub(req) {

  const options = {
    clientId: key,
    clientSecret: seceret,
    callbackUrl: gitcallbackUrl,
    path: '/auth/github',
    scope: 'user'
  };
  module.exports.options = options;
  github = require('./src/authentication/github');
}

function getFacebook(req) {

  const options = {
    appId: key,
    appSecret: seceret,
    callbackUrl: fbcallbackUrl,
    path: '/auth/facebook',
    fields: 'name,email,cover,first_name'
  };
  module.exports.options = options;
  fb = require('./src/authentication/facebook');
}

function getGplus(req) {

  const options = {
    clientId: key,
    clientSecret: seceret,
    callbackUrl: gpluscallbackUrl,
    path: '/auth/Gplus',
    scope: 'https://www.googleapis.com/auth/plus.me',
    access_type: 'offline'
  };
  module.exports.options = options;
  Gplus = require('./src/authentication/Gplus');
}

function getLinkedin(req) {

  const options = {
    clientId: key,
    clientSecret: seceret,
    callbackUrl: linkedincallbackUrl,
    path: '/auth/linkedin',
    scope: 'r_basicprofile r_emailaddress'
  };
  module.exports.options = options;
  linkedin = require('./src/authentication/linkedin');
}
