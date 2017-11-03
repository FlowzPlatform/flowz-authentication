module.exports = { 
    secret: process.env.SECRET, 
    database: process.env.MONGODB, 
    ldapUrl: "ldap://172.16.61.101:389",
    ldapDc: "dc=ldapserver,dc=local",
    adminDn: "cn=admin,dc=ldapserver,dc=local",
    adminPass: "123456"
};
