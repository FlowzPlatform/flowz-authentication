'use strict'
const {send,json} = require('micro');
const student = require('./services/user.service');
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
    path: '/students',
    handler: student.liststudent,
  },
  {
    method: 'get',
    path: '/students/student/:uName',
    handler: student.getstudent,
  },
  {
    method: 'post',
    path: '/students',
    handler: student.savestudent,
  },
  {
    method: 'put',
    path: '/students/student/:uName',
    handler: student.updatestudent,
  },
  {
    method: 'delete',
    path: '/students/student/:uName',
    handler: student.deletestudent,
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
