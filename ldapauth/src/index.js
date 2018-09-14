const { send } = require('micro')
const { router, get, post, options } = require('microrouter')
const user = require('./services/user.service');

const hello = async(req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With")

    send(res, 200, await Promise.resolve(`Hello ${req.params.who}`))
}

const hellopost = async(req, res) =>
    send(res, 200, await Promise.resolve(`Hello post`))

const notfound = (req, res) =>
    send(res, 404, 'Not found route')

module.exports = router(
    get('/userslist/:role', user.userlist),
    get('/getroles', user.getroles),
    post('/addRoles', user.addRoles),
    post('/userauth', user.userauth),
    post('/useradd', user.useradd),
    get('/importuser', user.importuser),
    post('/setpermission', user.setPermission),
    get('/getpermission/:app/:taskType/:roleId/:resourceId', user.getPermission),
    get('/getallrolepermission/:app/:taskType/:roleId', user.getAllRolePermission),
    get('/getallpermission/:app', user.getAllPermission),
    post('/init', user.init),
    get('/groupRoles', user.groupRoles),
    get('/hello/:who', hello),
    get('/*', notfound),
    options('/*', user.corsoption)
)
