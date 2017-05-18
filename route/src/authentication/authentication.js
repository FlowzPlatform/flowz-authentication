const { json, send, createError } = require('micro');
const { compareSync, hash } = require('bcrypt');
const { sign, verify } = require('jsonwebtoken');
const microAuthGithub = require('microauth-github');
const users = require('../services/user.service');
let mongoose = require('mongoose');
const assert = require('assert');

const { secret } = require('../config');
const User = require('../models/user');

const options = {
  clientId: '25930191109a85c4e5fb',
  clientSecret: 'f5c83db45af0333f51a727c4244a78c570b8bd46',
  callbackUrl: 'http://localhost:3000/auth/github/callback',
  path: '/auth/github',
  scope: 'user'
};

const githubAuth = microAuthGithub(options);

/**
 * Attempt to authenticate a user.
 */
const attempt = (username, password) => {
  return User.find({ username: username }).exec().then((users, err) => {
    if (!users.length) {
      throw createError(401, 'That user does not exist');
    }

    const user = users[0];
    if (!compareSync(password, user.password)) {
      throw createError(401, 'Wrong password');
    }
    return user;
  });
};

/**
 * Authenticate a user and generate a JWT if successful.
 */
const auth = ({ username, password }) =>
  attempt(username, password).then(({ id }) => {
    let token = sign(id, secret);
    return { token: token };
  });

const decode = token => verify(token, secret);

module.exports.login = async (req, res) => await auth(await json(req));

module.exports.decode = (req, res) => decode(req.headers['authorization']);

module.exports.github = githubAuth(async (req, res, auth) => {

  if (!auth) {
    return send(res, 404, 'Not Found');
  }

  if (auth.err) {
    // Error handler
    return send(res, 403, 'Forbidden');
  }

  send(res, 200, await users.setup());

});
