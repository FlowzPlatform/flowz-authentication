const { send,json } = require('micro');
const users = require('./src/services/user.service');
const db = require('./src/models/db');
const route = require('micro-route')
let auth;

const corsRoute = route('*', 'OPTIONS')
const fooRoute = route('/api/users', 'POST')
const signupRoute = route('/auth/github')
const callbackRoute = route('/auth/github/callback')

module.exports = async function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET,HEAD,OPTIONS,POST,PUT,DELETE'
  );

  if (corsRoute(req)) {
    // Send CORS headers
      return '';
  } else if (fooRoute(req)) {
      try {
        if (auth.decode(req, res) !== null) {
              send(res, 200, await users.list());
        }
  } catch (err) {
    if (process.env.NODE_ENV !== 'production' && err.stack) {
      console.error(err.stack);
    }

    send(res, err.statusCode || 500, { error: true, message: err.message });
  }
} else if(signupRoute(req)) {
    url1 = req.url.split("?")
    url2 = url1[1].split("&")
    url3 = url2[0].split("=")
    url4 = url2[1].split("=")
    url5 = url2[2].split("=")
    url6 = url2[3].split("=")
    url7 = url2[4].split("=")

    const options = {
      clientId: url3[1],
      clientSecret: url4[1],
      callbackUrl: url5[1],
      path: url6[1],
      scope: url7[1]
    };

    module.exports.options = options;
    auth = require('./src/authentication/authentication');
    return auth.github(req, res);
  } else if(callbackRoute(req)) {
      return auth.github(req, res);
    }
}
