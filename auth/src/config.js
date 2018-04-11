module.exports = {
    secret: process.env.SECRET,
    database: process.env.MONGODB,
    sendemailurl:'http://api.' + process.env.DOMAINKEY + '/vmailmicro/sendPassword'
};
