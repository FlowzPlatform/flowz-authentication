'use strict'
const { json, send, createError } = require('micro');
const route = require('micro-route');
//const users = require('./src/services/user.service');
const auth = require('./authentication/authentication');
const loginRoute = route('/login', 'POST')


module.exports = async function (req,res) {

    try {
      if (loginRoute(req)) {
          return auth.login(req, res);          
      }
    }catch (err) {
      if (process.env.NODE_ENV !== 'production' && err.stack) {
        console.error(err.stack);
      }
      send(res, err.statusCode || 500, { error: true, message: err.message });
    }
}
