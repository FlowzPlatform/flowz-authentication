const { send,json } = require('micro');
const users = require('./src/services/user.service');
const auth = require('./src/authentication/authentication');
const db = require('./src/models/db');
const route = require('micro-route')

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
    return auth.github(req, res);
  } else if(callbackRoute(req)) {
      return auth.github(req, res);
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
