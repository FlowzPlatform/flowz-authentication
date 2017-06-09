'use strict'

const visualize = require('micro-visualize')

module.exports = visualize(async function (req, res) {
  return 'Hello, world!'
})
