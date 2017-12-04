
module.exports = {
    ldapUrl:"ldap://localhost:389", 
    ldapDc: "dc=ldapdocker,dc=doc",
    adminDn: "cn=admin,dc=ldapdocker,dc=doc",
    adminPass: "admin password",
    approot: "apps",
    tasktype: "tasktype",
    resources: "resources",
    userNs: "users",
    groupNs: "groups",
    groupDn: "ou=groups,dc=ldapdocker,dc=doc",
    groupRoles : "groupRoles",
    jwtKey: "abcdefgabcdefg",
    directorypath: "/home/users/",
    userPass:"user password",
    importUserUrl: 'http://xxx.xx.xxx.xx:xxxx/api/xero/contacts?name=Krishna&app=Private%20Demo%20Company'
};
