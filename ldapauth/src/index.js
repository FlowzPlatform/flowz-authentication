const { send } = require('micro')
const { router, get, post } = require('microrouter')
const user = require('./services/user.service');

const hello = async(req, res) =>
    send(res, 200, await Promise.resolve(`Hello ${req.params.who}`))

const hellopost = async(req, res) =>
    send(res, 200, await Promise.resolve(`Hello post`))

const notfound = (req, res) =>
    send(res, 404, 'Not found route')

module.exports = router(
    get('/userslist', user.userlist),
    get('/getroles', user.getroles),
    post('/userauth', user.userauth),
    post('/useradd', user.useradd),
    post('/setpermission', user.setPermission),
    get('/getpermission/:app/:taskType/:roleId/:resourceId', user.getPermission),
    post('/init', user.init),
    //post('/hellopost', hellopost),
    get('/hello/:who', hello),
    get('/*', notfound)
)

//const Router = require('micro-http-router');
// Initialize the router
//const router = new Router();

/*
// Define a basic GET request
router.route({
    path: '/user',
    method: 'GET',
    handler: (req, res) => {
        return 'Hello, world 123';
    }
});

module.exports = async () => {
  //return 'Hello, world'
  return router
}
*/