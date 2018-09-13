const { json, send} = require('micro')

const { sign, verify } = require('jsonwebtoken');
const _ = require('lodash')
const ldapConfig = require('../config.js');
const cors = require('micro-cors')()
let request = require('request');

let Ajv = require('ajv');
let ajv = new Ajv({ allErrors: true });

const ldapschema = require('../schema/schema.js')

const io = require('socket.io')(ldapConfig.socketPort);
io.on('connection', socket => {});

let ldap = require('ldapjs');

// cached Variables
let cacheRoleResource = {}
let cacheModuleWise = {}
let cacheModuleRoleWise = {}

// console.log("binding :: " + ldapConfig.ldapUrl);
// ldap://localhost:389
// let ldapUrl = "ldap://" + "ldapserver"
let client = ldap.createClient({
    url: ldapConfig.ldapUrl
});

let self = {
    userlist: cors(async(req, res) => {
        try {
            let reqRole = _.replace(req.params.role, '%20', ' ')
            let rolesUsers = [];
            let isAdminAuth = isUserAuth = false;
            isAdminAuth = await self.ldapbind(ldapConfig.adminDn, ldapConfig.adminPass);

            if (isAdminAuth.auth) {

                let searchOptions = {
                    filter: '(cn=' + reqRole + ')',
                    scope: 'sub',
                    attributes: ['memberUid']
                };

                let strDn = ldapConfig.groupDn;
                let result = await self.ldapsearch(strDn, searchOptions);

                for (let p in result.response) {
                    if (result.response.hasOwnProperty(p)) {
                        if (!_.isObject(result.response[p].memberUid)) {
                            rolesUsers = [result.response[p].memberUid];
                        } else {
                            rolesUsers = result.response[p].memberUid;
                        }
                    }
                }
            }

            let roleusers = {
                'status': 1,
                'data': {
                    'roles': rolesUsers
                }
            }
            //return roleusers;
            send(res, 200, roleusers);
        } catch (err) {
            console.log(err);
        }
    }),

    userlist1: async(req, res) => {
        try {
            client.bind(ldapConfig.adminDn, ldapConfig.adminPass, function(err) {
            });
            return "userslist..";
        } catch (err) {
            console.log(err);
        }
    },

    abc: async(a) => {
        console.log(a);
    },

    ldapbind: async(strBindDn, strPass) => {
        return new Promise((resolve, reject) => {
            client.bind(strBindDn, strPass, function(err) {
                if (!err) {
                  resolve({ 'auth': true });
                } else {
                  resolve({ 'auth': false });
                }
            });
        });
    },

    ldapentry: async(strDn, entry) => {
        return new Promise((resolve, reject) => {
            client.add(strDn, entry, function(err, res) {
                if (err) {
                    resolve(false);
                  } else {
                    resolve(true);
                }
            });
        });
    },


    ldapmodify: async(strDn, attrs, operation) => {
        return new Promise((resolve, reject) => {
            let change = new ldap.Change({
                operation: operation,
                modification: attrs
            });
            client.modify(strDn, change, function(err, res) {
                if (err) {
                  resolve(false);
                } else {
                  resolve(true);
                }
            });
        });
    },

    ldapsearch: async(strDn, options) => {

        let searchData = [];
        return new Promise((resolve, reject) => {
            client.search(strDn, options, function(err, res) {
                res.on('searchEntry', function(entry) {
                    searchData.push(entry.object)
                });
                res.on('searchReference', function(referral) {
                });
                res.on('error', function(err) {
                    resolve({});
                });
                res.on('end', function(result) {
                    resolve({ 'response': searchData });
                });
            });
        });

    },

    getroles: async() => {

        let searchOptions = {
            filter: '(objectClass=posixGroup)',
            scope: 'sub',
            attributes: ['cn']
        };
        let roles = [];

        isAdminAuth = await self.ldapbind(ldapConfig.adminDn, ldapConfig.adminPass);

        if (isAdminAuth.auth) {

            let strDn = ldapConfig.groupDn;
            let result = await self.ldapsearch("ou=groups,dc=ldapdocker,dc=doc", searchOptions);

            for (let p in result.response) {
                if (result.response.hasOwnProperty(p)) {
                  roles.push(result.response[p].cn)
                }
            }
        }

        let allRoles = {
            'status': 1,
            'data': {
                'roles': roles
            }
        }
        return allRoles;
    },

    userroles: async(uid) => {

        let searchOptions = {
            filter: '(memberUid=' + uid + ')',
            scope: 'sub',
            attributes: ['cn']
        };
        let strDn = 'ou=groups,' + ldapConfig.ldapDc;
        let result = await self.ldapsearch(strDn, searchOptions);

        let userRoles = [];
        for (let p in result.response) {
            if (result.response.hasOwnProperty(p)) {
                userRoles.push(result.response[p].cn)
            }
        }
        return userRoles;
    },

    useradd: cors(async(req, res) => {

        try {
            const body = await json(req)
            let isAdminAuth = isUserAuth = false;
            isAdminAuth = await self.ldapbind(ldapConfig.adminDn, ldapConfig.adminPass);
            if (isAdminAuth.auth) {
                //  admin is authenticated, search for given user
                let searchOptions = {
                    filter: '(mail=' + body.email + ')',
                    scope: 'sub'
                };

                let strDn = 'ou=' + ldapConfig.userNs + ',' + ldapConfig.ldapDc;
                let result = await self.ldapsearch(strDn, searchOptions);

                if (result.response.length) {

                } else {
                    let entry = {
                        cn: body.cn,
                        sn: body.sn,
                        gidNumber: body.gidNumber,
                        givenname: body.givenname,
                        homedirectory: ldapConfig.directorypath + body.givenname,
                        objectclass: ['inetOrgPerson', 'posixAccount', 'top'],
                        mail: body.mail,
                        uid: body.uid,
                        uidNumber: body.uidNumber,
                        userpassword: body.userpassword
                    };
                    let clientAddPath = 'cn=' + entry.cn + "," + "ou=" + ldapConfig.userNs + "," + ldapConfig.ldapDc;
                    return new Promise((resolve, reject) => {
                        client.add(clientAddPath, entry, function(err, res) {

                            if (!err) {
                                resolve({ "status": 1, "code": 200, "message": "user registerd succesfully" })
                            } else {
                                resolve({ "status": 0, "code": 404, "message": "user registration failed", "error": err })
                            }
                        });
                    })
                }
            }
        } catch (err) {
            console.log(err);
        }
    }),

    importuserentry: async(userdata) => {
        for (let key in userdata) {
            if (userdata.hasOwnProperty(key)) {
                let val = userdata[key];
                for (let i = 0; i < val.length; i++) {
                    let searchOptions = {
                        filter: '(mail=' + val[i].data.EmailAddress + ')',
                        scope: 'sub'
                    };
                    let strDn = "ou=" + ldapConfig.userNs + "," + ldapConfig.ldapDc;
                    let result = await self.ldapsearch(strDn, searchOptions);

                    if (!result.response.length) {
                        let entry = {
                            cn: val[i].data.Name,
                            sn: val[i].data.Name,
                            gidNumber: 503,
                            givenname: val[i].data.Name,
                            homedirectory: ldapConfig.directorypath + val[i].data.Name,
                            objectclass: ['inetOrgPerson', 'posixAccount', 'top'],
                            mail: val[i].data.EmailAddress,
                            telephoneNumber: val[i].data.Phones[3].PhoneNumber,
                            uid: val[i].data.Name,
                            uidNumber: 5055,
                            userpassword: ldapConfig.userPass
                        };
                        let clientAddPath = 'cn=' + entry.cn + "," + "ou=" + ldapConfig.userNs + "," + ldapConfig.ldapDc;
                        let entryresponse = await self.ldapentry(clientAddPath, entry);
                    } else {
                        console.log("user found")
                    }
                }
            }
        }
        return (true)
    },

    importuser: cors(async(req, res) => {

        let isAdminAuth = isUserAuth = false;
        isAdminAuth = await self.ldapbind(ldapConfig.adminDn, ldapConfig.adminPass);

        let userdata = await self.getuserdata();

        let importuserentry = await self.importuserentry(userdata);

        send(res, "200", { "status": 1, "code": "200", "message": "import users succsfully" })
    }),

    getuserdata: async() => {

        return new Promise((resolve, reject) => {
            request(ldapConfig.importUserUrl, function(error, response, body) {
                let impdata = JSON.parse(body).data;
                resolve(impdata);
            });
        });
    },

    setPermission: cors(async(req, res) => {
        try {
            const body = await json(req)
            let resCode = 200;
            let resBody = {};
            if (!ajv.validate(ldapschema.setPermission, body)) {
                resCode = 404;
                resBody = { 'status': 0, 'code': 404, 'error': ajv.errors }
                send(res, resCode, resBody)
            } else {
              let isAdminAuth = await self.ldapbind(ldapConfig.adminDn, ldapConfig.adminPass);
              const dnAppRootPath = "ou=" + ldapConfig.approot + "," + ldapConfig.ldapDc;
              const dnAppPath = "ou=" + body.app + "," + dnAppRootPath;
              const dnTaskTypeNs = "ou=" + ldapConfig.tasktype + "," + dnAppPath;

              // check/create given task-type
              const dnTaskTypePath = "ou=" + body.taskType + "," + dnTaskTypeNs;
              // chcek/create "role" as ou exist or not
              let dnRoleOu = "ou=roles," + dnTaskTypePath;
              // check/create given role exist or not
              let dnRolePath = "cn=" + body.roleId + "," + dnRoleOu;
              // check/create given resource exist or not
              let dnResourcePath = "ou=" + body.resourceId + ",ou=resources," + dnAppPath;
              if (isAdminAuth.auth
                  && await self.checkOrgUnit(body.taskType, dnTaskTypePath)
                  && await self.checkOrgUnit("roles", dnRoleOu)
                  && await self.checkOrgRole(body.roleId, dnRolePath)
                  && await self.checkOrgUnit(body.resourceId, dnResourcePath)
                ) {
                  let cacheKey = `${body.app}_${body.taskType}_${body.roleId}_${body.resourceId}`;
                  let cacheRole = `${body.app}_${body.taskType}_${body.roleId}`
                  let cacheGetAll = `${body.app}`

                  let attrs = {
                      roleOccupant: [dnResourcePath]
                  }
                  await self.ldapmodify(dnRolePath, attrs, 'add');
                  // check if changing attr "l" already exist
                  await self.updateResourceAccess(dnRolePath, body.resourceId, body.accessValue);
                  delete cacheRoleResource[cacheKey];
                  delete cacheModuleWise[cacheGetAll];
                  delete cacheModuleRoleWise[cacheRole];
                  io.emit('permissionChanged', {
                    app:body.app,
                    taskType:body.taskType,
                    roleId:body.roleId,
                    resourceId:body.resourceId
                  });
                  resBody = { 'status': 1, 'message': 'Permission set successfully' };
              } else {
                  resCode = 404;
                  resBody = { 'status': 0, 'message': 'Authentication failed' }
              }
              send(res, resCode, resBody);
            }
        } catch (err) {
            console.log(err);
        }
    }),

    updateResourceAccess: async(dnRolePath, resourceId, accessValue) => {
        try {
            let opts = {
                scope: 'sub',
                attributes: ['l']
            }
            let resAcc = await self.ldapsearch(dnRolePath, opts);

            if (resAcc && !_.isEmpty(resAcc.response)) {
                // replace current res with new accessVal
                if (resAcc.response[0].l) {
                    let objAttrL;
                    if (_.isObject(resAcc.response[0].l)) {
                        objAttrL = resAcc.response[0].l
                    } else {
                        objAttrL = [resAcc.response[0].l];
                    }

                    let currentAttr;
                    if (objAttrL) {
                        currentAttr = _.find(objAttrL, function(str) {
                            let strL = str.substring(0, str.indexOf(':'));
                            //return num % 2 == 0;
                            return (strL == resourceId);
                        })
                    }
                    if (currentAttr) {
                        let attrs = {
                            l: [currentAttr]
                        }
                        await self.ldapmodify(dnRolePath, attrs, 'delete');
                    }
                }
            }

            // add new res with accessVal
            let attrs = {
                l: [resourceId + ":" + accessValue]
            }
            await self.ldapmodify(dnRolePath, attrs, 'add');
        } catch (err) {
            console.log(err)
        }
    },

    getPermission: cors(async(req, res) => {
        try {
            let isAdminAuth = isUserAuth = false;
            let cacheKey = `${req.params.app}_${req.params.taskType}_${req.params.roleId}_${req.params.resourceId}`;

            if (cacheRoleResource[cacheKey]) {
              return cacheRoleResource[cacheKey]
            }
            isAdminAuth = await self.ldapbind(ldapConfig.adminDn, ldapConfig.adminPass);
            if (isAdminAuth.auth) {
                const dnAppRootPath = "ou=" + ldapConfig.approot + "," + ldapConfig.ldapDc;
                const dnAppPath = "ou=" + req.params.app + "," + dnAppRootPath;
                const dnTaskTypeNs = "ou=" + ldapConfig.tasktype + "," + dnAppPath;
                const dnTaskTypePath = "ou=" + req.params.taskType + "," + dnTaskTypeNs;

                const searchPath = "cn=" + req.params.roleId + ",ou=roles," + dnTaskTypePath;
                const roleOcc = "ou=" + req.params.resourceId + ",ou=resources," + dnAppPath;

                let opt = {
                    filter: '(roleOccupant=' + roleOcc + ')',
                    scope: 'sub',
                    attributes: ['l']
                };

                let res = await self.ldapsearch(searchPath, opt);

                let resourceAccess;
                if (!_.isEmpty(res.response)) {

                    let objAttrL;
                    if (_.isObject(res.response[0].l)) {
                        objAttrL = res.response[0].l
                    } else {
                        objAttrL = [res.response[0].l];
                    }
                    resourceAccess = _.find(objAttrL, function(str) {
                        let strL = str.substring(0, str.indexOf(':'));
                        //return num % 2 == 0;
                        return (strL == req.params.resourceId);
                    })
                }
                let accVal = 0;
                if (resourceAccess) {
                    accVal = resourceAccess.substring(resourceAccess.indexOf(':') + 1);
                }
                cacheRoleResource[cacheKey] = { 'status': 1, 'data': { 'accessValue': accVal } }
                return cacheRoleResource[cacheKey]
            }
        } catch (err) {
            console.log(err)
        }
    }),

    corsoption: cors(async(req, res) => {
        return '';
    }),

    getAllPermission: cors(async(req, res) => {
        try {
            let cacheGetAll = `${req.params.app}`
            if(cacheModuleWise[cacheGetAll]) {
              return cacheModuleWise[cacheGetAll]
            }

            let isAdminAuth = isUserAuth = false;
            isAdminAuth = await self.ldapbind(ldapConfig.adminDn, ldapConfig.adminPass);

            if (isAdminAuth.auth) {

                const dnAppRootPath = "ou=" + ldapConfig.approot + "," + ldapConfig.ldapDc;
                const dnAppPath = "ou=" + req.params.app + "," + dnAppRootPath;
                const dnTaskTypeNs = "ou=" + ldapConfig.tasktype + "," + dnAppPath;

                let opt = {
                    filter: '(objectClass=organizationalRole)',
                    scope: 'sub'
                };

                let res = await self.ldapsearch(dnTaskTypeNs, opt);

                let resourceAccess;
                let allPerm = [];
                if (!_.isEmpty(res.response)) {

                    _.forEach(res.response, function(value) {
                        let reTasktype = value.dn.match("ou=roles,ou=(.*),ou=tasktype");
                        let strTasktype = reTasktype[1];

                        let objAttrL;
                        if (_.isObject(value.l)) {
                            objAttrL = value.l
                        } else {
                            objAttrL = [value.l];
                        }

                        _.forEach(objAttrL, function(valL) {
                            let objResAcc = _.split(valL, ':');
                            let obj = {
                                    'taskType': strTasktype,
                                    'roleId': value.cn,
                                    'resourceId': objResAcc[0],
                                    'access_value': objResAcc[1],
                                }
                            allPerm.push(obj);
                        })
                    });
                }
                cacheModuleWise[cacheGetAll] = { 'status': 1, 'data': allPerm }
                return cacheModuleWise[cacheGetAll]
            }
        } catch (err) {
            console.log(err)
        }
    }),
    getAllRolePermission: cors(async(req, res) => {
        try {
            let cacheRole = `${req.params.app}_${req.params.taskType}_${req.params.roleId}`
            if(cacheModuleRoleWise[cacheRole]) {
              return cacheModuleRoleWise[cacheRole]
            }

            let isAdminAuth = isUserAuth = false;
            isAdminAuth = await self.ldapbind(ldapConfig.adminDn, ldapConfig.adminPass);

            if (isAdminAuth.auth) {

                const dnAppRootPath = "ou=" + ldapConfig.approot + "," + ldapConfig.ldapDc;
                const dnAppPath = "ou=" + req.params.app + "," + dnAppRootPath;
                const dnTaskTypeNs = "ou=" + ldapConfig.tasktype + "," + dnAppPath;
                const dnTaskTypePath = "ou=" + req.params.taskType + "," + dnTaskTypeNs;

                const searchPath = "cn=" + req.params.roleId + ",ou=roles," + dnTaskTypePath;

                let opt = {
                    filter: '(objectClass=organizationalRole)',
                    scope: 'sub'
                };

                let res = await self.ldapsearch(searchPath, opt);

                let resourceAccess;
                let allPerm = [];
                if (!_.isEmpty(res.response)) {

                    _.forEach(res.response, function(value) {
                        let reTasktype = value.dn.match("ou=roles,ou=(.*),ou=tasktype");
                        let strTasktype = reTasktype[1];

                        let objAttrL;
                        if (_.isObject(value.l)) {
                            objAttrL = value.l
                        } else {
                            objAttrL = [value.l];
                        }

                        _.forEach(objAttrL, function(valL) {
                            let objResAcc = _.split(valL, ':');
                            let obj = {
                                    'taskType': strTasktype,
                                    'roleId': value.cn,
                                    'resourceId': objResAcc[0],
                                    'access_value': objResAcc[1],
                                }
                            allPerm.push(obj);
                        })
                    });
                }
                cacheModuleRoleWise[cacheRole] = { 'status': 1, 'data': allPerm }
                return cacheModuleRoleWise[cacheRole]
            }
        } catch (err) {
            console.log(err)
        }
    }),
    
    checkOrgUnit: async(unitName, strDn) => {
        let result = await self.ldapsearch(strDn, {});
        if (_.isEmpty(result)) {
            let entry = {
                ou: unitName,
                objectclass: ['organizationalUnit'],
            }
            return await self.ldapentry(strDn, entry);
        }
        return true;
    },

    checkOrgRole: async(roleName, strDn) => {
        let result = await self.ldapsearch(strDn, {});
        if (_.isEmpty(result)) {
            let entry = {
              cn: roleName,
              objectclass: ['organizationalRole'],
            }
            return await self.ldapentry(strDn, entry);
        }
        return true;
    },

    checkgroupOfUniqueNames: async(groupname, strDn, uniqueMember, owner) => {
        let result = await self.ldapsearch(strDn, {});
        let entry = {
            cn: groupname,
            objectclass: ['groupOfUniqueNames'],
            owner: owner,
            uniqueMember: uniqueMember
        }
        return await self.ldapentry(strDn, entry);

    },

    init: cors(async(req, res) => {
        const body = await json(req)

        let isAdminAuth = isUserAuth = false;
        isAdminAuth = await self.ldapbind(ldapConfig.adminDn, ldapConfig.adminPass);

        if (isAdminAuth.auth) {

            appName = body.app;
            // check if unit "apps" exist or not
            const dnAppRootPath = "ou=" + ldapConfig.approot + "," + ldapConfig.ldapDc;
            await self.checkOrgUnit(ldapConfig.approot, dnAppRootPath)

            // check if unit given app exist or not
            const dnAppPath = "ou=" + appName + "," + dnAppRootPath;
            await self.checkOrgUnit(appName, dnAppPath)

            // check "taskType" as "resources" as unit inside given app
            const dnTaskTypeNs = "ou=" + ldapConfig.tasktype + "," + dnAppPath;
            await self.checkOrgUnit(ldapConfig.tasktype, dnTaskTypeNs);

            const dnResourceNs = "ou=" + ldapConfig.resources + "," + dnAppPath;
            await self.checkOrgUnit(ldapConfig.resources, dnResourceNs);

            const dnUserPath = "ou=" + ldapConfig.userNs + "," + ldapConfig.ldapDc;
            await self.checkOrgUnit(ldapConfig.groupNs, dnUserPath)

            const dnRolePath = "ou=" + ldapConfig.groupNs + "," + ldapConfig.ldapDc;
            await self.checkOrgUnit(ldapConfig.groupNs, dnRolePath)

            send(res, 200, { message: 'Ldap server initalized.' })
        } else {
            send(res, 403, { message: 'Authentication error.' })
        }

    }),

    addRoles: cors(async(req, res) => {
        const body = await json(req)
        let groupname = body.groupname;
        let uniqueMember = body.um;
        let owner = body.owner;
        let strDn = "ou=" + ldapConfig.groupRoles + "," + ldapConfig.ldapDc

        let isAdminAuth = isUserAuth = false;
        isAdminAuth = await self.ldapbind(ldapConfig.adminDn, ldapConfig.adminPass);

        if (isAdminAuth.auth) {
            await self.checkOrgUnit(ldapConfig.groupRoles, strDn)
            let addrolepath = "cn=" + body.groupname + "," + strDn;
            let result = await self.checkgroupOfUniqueNames(groupname, addrolepath, uniqueMember, owner)
            if (result == true) {
                send(res, 200, { "status": "1", "code": "200", "message": "Role added succesfully" })
            } else {
                send(res, 404, { "status": "0", "code": "404", "message": "adding entry failed", "result": result })
            }
        }
    }),

    groupRoles: cors(async(req, res) => {
        let isAdminAuth = isUserAuth = false;
        isAdminAuth = await self.ldapbind(ldapConfig.adminDn, ldapConfig.adminPass);
        if (isAdminAuth.auth) {
            let strDn = "ou=" + ldapConfig.groupRoles + "," + ldapConfig.ldapDc;
            await self.checkOrgUnit(ldapConfig.groupRoles, strDn)

            let searchOptions = {
                filter: 'objectclass=*',
                scope: 'sub',
                attributes: ['cn', 'owner']
            };

            let result = await self.ldapsearch(strDn, searchOptions);
            let grouproles = result.response
            let mapdata = grouproles.map(a => a.owner);
            let matchowner = newData(mapdata)

            function newData(data) {
                let matchowner = [];
                for (let i in data) {
                    if (data[i] instanceof Array) {
                        let multiData = newData(data[i])
                        matchowner.push(multiData)
                    } else if (data[i]) {
                        let spdata = data[i].split(",")[0].split('=')[1];
                        matchowner.push(spdata)
                    } else {
                        matchowner.push(data[i])
                    }
                }
                return matchowner
            }

            for (let i = 0; i < grouproles.length; i++) {
                grouproles[i].rolename = grouproles[i].cn;
                grouproles[i].owner = matchowner[i]
                grouproles[i].owner = matchowner[i]
                delete grouproles[i].cn;
                delete grouproles[i].dn;
                delete grouproles[i].controls;
            }
            send(res, 200, { "status": "1", "code": "200", grouproles })
        }
    }),

    userauth: cors(async(req, res) => {
        try {
            const body = await json(req)
            let valid = ajv.validate(ldapschema.userAuth, body);
            if (!valid) {
                let resCode = 404;
                let resBody = { 'status': 0, 'code': 404, 'error': ajv.errors }
                send(res, resCode, resBody)
                
                return;
            }

            let isAdminAuth = isUserAuth = false;
            isAdminAuth = await self.ldapbind(ldapConfig.adminDn, ldapConfig.adminPass);

            if (isAdminAuth.auth) {
                //  admin is authenticated, search for given user
                let searchOptions = {
                    filter: '(uid=' + body.userid + ')',
                    scope: 'sub'
                };

                let strDn = 'ou=users,' + ldapConfig.ldapDc;
                let result = await self.ldapsearch(strDn, searchOptions);

                if (result.response.length) {

                    let searchUserDn = result.response[0].dn;

                    isUserAuth = await self.ldapbind(searchUserDn, body.passwd);

                    if (isUserAuth.auth) {
                        let userData = {
                            'authenticated': true,
                            'uid': body.userid
                        }
                        let token = sign(userData, ldapConfig.jwtKey);
                        let authRes = { 'status': 1, 'code': 200, 'message': 'succesfully authenticated', 'token': token };
                        send(res, 200, authRes);
                        return;
                        //return isUserAuth;
                    } else {
                        send(res, 404, { 'status': 0, 'code': 404, 'message': 'authentication failed', 'error': 'invalid credentials' });
                        return;
                    }
                } else {
                    send(res, 404, { 'status': 0, 'code': 404, 'message': 'authentication failed', 'error': 'invalid credentials' });
                    return;
                }
            }
            send(res, 404, { 'auth': false });
        } catch (err) {
            console.log(err);
            send(res, 403, { 'auth': false, 'error': err });
        }
        return;
    })
};

module.exports = self;
