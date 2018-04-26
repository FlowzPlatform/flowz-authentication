module.exports = {
    secret: process.env.SECRET,
    database: process.env.MONGODB,
    sendemailurl:'http://api.' + process.env.DOMAINKEY + '/vmailmicro/sendemaildata',
    accountSid: process.env.accountSid, // Your Account SID 
    authToken: process.env.authToken,  // Your Auth Token 
    no1 : process.env.no1,
    no2 : process.env.no2,
    FROM : process.env.FROM,
};
