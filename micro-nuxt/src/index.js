'use strict'
const { send, createError, json } = require('micro')

module.exports = async function (req,res) {
  let responce = [{
            "id": 4,
            "first_name": "eve brown",
            "last_name": "holt",
            "avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/marcoramires/128.jpg"
        },
        {
            "id": 5,
            "first_name": "gob silenja",
            "last_name": "bluth",
            "avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/stephenmoon/128.jpg"
        },
        {
            "id": 6,
            "first_name": "tracey harbar",
            "last_name": "bluth",
            "avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/bigmancho/128.jpg"
        }];

  send(res,200,responce)
}
