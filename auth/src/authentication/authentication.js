const { json, send, createError } = require('micro');
const { compareSync, hash } = require('bcrypt');
const { sign, verify } = require('jsonwebtoken');
const users = require('../services/user.service');
let mongoose = require('mongoose');
const assert = require('assert');

const { secret } = require('../config');
const User = require('../models/user');

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
  id2 = {
    "userId": id,
    "iat": Math.floor(Date.now() / 1000) - 30,
    "exp": Math.floor(Date.now() / 1000) + (60 * 60),
    "aud": "https://yourdomain.com",
    "iss": "feathers",
    "sub": "anonymous"
  }
    let token = sign(id2, secret);
    return { id:id, username:username,token: token  };
  });

const decode = token => verify(token, secret);

module.exports.login = async (req, res) => await auth(await json(req));

module.exports.decode = (req, res) => decode(req.headers['authorization']);


const sociallogin = (req) => {
  id = req.result.info.id;

  let token = sign(id, secret);
  return { token: token };

}

module.exports.sociallogin = sociallogin

module.exports.me = async(req) => {
  let data;
  data = verify(req.headers['authorization'], secret);

  return User.find({ _id: data.userId }).exec().then((users, err) => {
    if (!users.length) {
      throw createError(401, 'That user does not exist');
    }

    const user = users[0];

    return user;
  });


}
