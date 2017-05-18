const { send,json } = require('micro');
const users = require('./src/services/user.service');
const db = require('./src/models/db');
const route = require('micro-route')
const auth = require('./src/authentication/authentication');
const github = require('./src/authentication/github');
const twitter = require('./src/authentication/twitter');
const fb = require('./src/authentication/facebook');
const microAuthGithub = require('microauth-github');


const corsRoute = route('*', 'OPTIONS')
const loginRoute = route('/api/login', 'POST')
const signupRoute = route('/api/setup')
const signupGitRoute = route('/auth/github')
const callbackGitRoute = route('/auth/github/callback')
const signupFbRoute = route('/auth/facebook')
const callbackFbRoute = route('/auth/facebook/callback')
const signuptwRoute = route('/auth/twitter')
const callbacktwRoute = route('/auth/twitter/callback')

module.exports = async function (req, res) {
  console.log("-------->");
  console.log(req.url);
  console.log("<---------");
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
  } else if (loginRoute(req)) {
        return auth.login(req, res);
  } else if (signupRoute(req)) {
        return users.setup(req, res);
  } else if(signupGitRoute(req)) {
      return github.github(req, res);
    } else if(callbackGitRoute(req)) {
        return github.github(req, res);
  } else if(signupFbRoute(req)) {
      return fb.facebook(req, res);
    } else if(callbackFbRoute(req)) {
        return fb.facebook(req, res);
  } else if(signuptwRoute(req)) {
      return twitter.twitter(req, res);
    } else if(callbacktwRoute(req)) {
        return twitter.twitter(req, res);
    }
}

/*
module.exports = async function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET,HEAD,OPTIONS,POST,PUT,DELETE'
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Authorization, Access-Control-Allow-Headers, Access-Control-Allow-Methods, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers'
  );

  if (req.method == 'OPTIONS') {
    return '';
  }
  try {
    switch (req.url) {
      case '/api/setup':
        send(res, 200, await users.setup());
        break;

      case '/api/authentication':
        return auth.login(req, res);

      case '/api/users':
        if (auth.decode(req, res) !== null) {
          send(res, 200, await users.list());
        }
        break;
      default:
        break;
    }
  } catch (err) {
    if (process.env.NODE_ENV !== 'production' && err.stack) {
      console.error(err.stack);
    }

    send(res, err.statusCode || 500, { error: true, message: err.message });
  }
};
*/
/*
const user = async (req, res) => {
  const body = await json(req)
  send(res, 200, body)
}

module.exports = router(
  post('/user', user)
)
*/
