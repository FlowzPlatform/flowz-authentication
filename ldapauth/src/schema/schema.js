
module.exports = {
  setPermission: {
    "properties": {
      "resouceId": { "type": "string" },
      "roleId": { "type": "string" },
      "taskType": { "type": "string" },
      "accessValue": { "type": "number" },
      "app": { "type": "string" }
    },
    "required": ["resouceId", "roleId", "taskType", "accessValue", "app"]
  },

  userAuth:{
    "properties": {
      "userid": { "type": "string" },
      "passwd": { "type": "string","minLength": 1 }
    },
    "required": ["userid", "passwd"]
  }
}