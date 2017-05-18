'use strict'
const micro = require('micro')

const server = micro((req, res) => {
  // enable session storage in cookie
  console.log('Serving index.html');
  res.end('Session started ms ago');
})

// fire it up
server.listen(3050)

module.exports = () => console.log('YOLO');
