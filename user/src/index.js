'use strict'
const {send,json} = require('micro');
const user = require('./services/user.service');
const db = require('./models/db');
const User = require('./models/user');
const cors = require('micro-cors')()
const visualize = require('micro-visualize')
const jwtAuth = require('micro-jwt-auth')
const rateLimit = require('micro-ratelimit')
const microApi = require('micro-api')


const compose = (...fns) => fns.reduce((f, g) => (...args) => f(g(...args)))

const handleErrors = fn => async (req, res) => {
  try {
    return await fn(req, res)
  } catch (err) {
      throw(err)
   }
}

const api = microApi([
  {
    method: 'get',
    path: '/alluserdetails',
    handler: user.alluserdetails,
  },
  {
    method: 'get',
    path: '/getuserdetails/:email',
    handler: user.getuserdetails,
  },
  // {
  //   method: 'post',
  //   path: '/students',
  //   handler: user.savestudent,
  // },
  {
    method: 'put',
    path: '/updateuserdetails/:email',
    handler: user.updateuserdetails,
  },
  {
    method: 'delete',
    path: '/deleteuserdetails/:email',
    handler: user.deleteuserdetails,
  },

])



const handler = async(req, res) => {
  const input = await json(req)
  send(res, 200, "output")
}

module.exports = compose(
  handleErrors,
  cors,
  rateLimit,
  jwtAuth("abcdefgabcdefg"),
  visualize
)(api)
