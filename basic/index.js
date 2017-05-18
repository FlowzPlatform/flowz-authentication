const parse = require('urlencoded-body-parser')
const { send,json } = require('micro');
const rateLimit = require('micro-ratelimit')
const visualize = require('micro-visualize')
const compress = require('micro-compress');
const jwtAuth = require('micro-jwt-auth')
const get = require('micro-get')
const post = require('micro-post')
const track = require('micro-stats')
const cors = require('micro-cors')()

const compose = (...fns) => fns.reduce((f, g) => (...args) => f(g(...args)))

const handleErrors = fn => async (req, res) => {
  try {
    return await fn(req, res)
  } catch (err) {
      throw(err)
   }
}

const handler = async(req, res) => {
  const input = await json(req)
  send(res, 200, "output")
}

module.exports.rateLimit = rateLimit({window: 10*1000, limit: 2}, (req, res) => {
  return 'Hello world'
})

const options = {
  errorCode: 404,
  response: 'My custom response',
  contentType: 'text/plain'
}

module.exports.post = post(options,async (req, res) => {
  return `It's a POST request!`
})

module.exports.get = get(async (req, res) => {
  return send(res, 200, `It's a GET request!`)
})

module.exports.track = track(function (req, res) {
  req.end(200)
})

module.exports = compose(
  jwtAuth(process.env.SECRET),
  handleErrors,
  //cors,
  track,
  post,
  rateLimit,
  compress,
  visualize
)(handler)
