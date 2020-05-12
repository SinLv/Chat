const Route = require('koa-router');
const routes = new Route();
const utils = require('utility')
const model = require('./model');
const User = model.getModel('user');
const Chat = model.getModel('chat');

routes.post('/user/register', async (ctx, next) => {
    const {user,pwd,type} = ctx.request.body;
    console.log(user,pwd,type);
    let result = await User.findOne({user: user});
    if (result) {
        ctx.response.body = {code: 1, msg:'用户名重复'};
    } else {
        const userModel = new User({user, type, pwd: md5Pwd(pwd)});
        let data = await userModel.save();
        console.log(data);
        // // 将id保存在cookie中
        ctx.cookies.set('userid', data._id);
        ctx.response.body = {code: 0, data:{user: data.user,type: data.type,_id: data._id}};
    }
    next();
}).post('/user/login', (ctx, next) => {
    const {user, pwd} = ctx.request.body;
    next();
}).get('/user/list', (cxt, next) => {
    const type = cxt.request.query;
    next();
}).get('/user/info', (ctx, next) => {
    const userid = ctx.cookies.get('userid');
    if (!userid) {
        ctx.response.body = {code: 1};
        next();
    }
    
})

function md5Pwd(pwd){
    const salt = 'th_is_good546dsadfdgr!@#~33'
    return utils.md5(utils.md5(pwd+salt))
}

module.exports = routes;