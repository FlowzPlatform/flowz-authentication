module.exports = {
    secret: process.env.SECRET,
    database: process.env.MONGODB
    ,sendemailurl:'http://api.' + process.env.DOMAINKEY + '/vmailmicro/sendemaildata'
    // ,sendemailurl:'http://localhost:3003/sendemaildata'
};
