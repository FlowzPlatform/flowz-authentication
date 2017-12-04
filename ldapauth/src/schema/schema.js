module.exports = {
    setPermission: {
        "properties": {
            "resourceId": { "type": "string" },
            "roleId": { "type": "string" },
            "taskType": { "type": "string" },
            "accessValue": { "type": "number" },
            "app": { "type": "string" }
        },
        "required": ["resourceId", "roleId", "taskType", "accessValue", "app"]
    },

    userAuth: {
        "properties": {
            "email": { "type": "string", "minLength": 1 },
            "passwd": { "type": "string", "minLength": 1 }
        },
        "required": ["email", "passwd"]
    }
}