
module.exports = {
    ldapUrl: process.env.LDAPURL,
    socketPort: 4042,
    ldapDc: "dc=ldapdocker,dc=doc",
    adminDn: "cn=admin,dc=ldapdocker,dc=doc",
    adminPass: process.env.ADMINPASS,
    approot: "apps",
    tasktype: "tasktype",
    resources: "resources",
    userNs: "users",
    groupNs: "groups",
    groupDn: "ou=groups,dc=ldapdocker,dc=doc",
    groupRoles : "groupRoles",
    jwtKey: process.env.SECRET,
    directorypath: "/home/users/",
    userPass: process.env.USERPASS,
    importUserUrl: process.env.IMPORTUSERURL + '/api/xero/contacts?name=Krishna&app=Private%20Demo%20Company'
};
