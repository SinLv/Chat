const Route = require('koa-router');
const routes = new Route();
const utils = require('utility')
const model = require('./model');
const User = model.getModel('user');
const Chat = model.getModel('chat');
const _filter = {'pwd':0,'__v':0}

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
}).post('/user/update', async (ctx, next) => {
    const userid = ctx.cookies.get('userid');
    if (!userid) { // 说明还没有注册
        ctx.response.body = {code: 1};
    }
    let result = await User.findByIdAndUpdate(userid, ctx.request.body);
    console.log(result);
    const data = Object.assign({}, {
        user: result.user,
        type: result.type,
    }, ctx.request.body);
    ctx.response.body = {code: 0, data};
    next();
}).post('/user/login', async (ctx, next) => {
    const {user, pwd} = ctx.request.body;
    let result = await User.findOne({user: user}, _filter);
    console.log(result);
    if (!result) {
        ctx.response.body = {code: 1, msg:'用户名或者密码错误'};
    } else {
        ctx.cookies.set('userid', result._id);
        ctx.response.body = {code: 0, data:result};
    }
    next();
}).get('/user/list', async (cxt, next) => {
    const {type} = cxt.request.query;
    console.log(type);
    let result = await User.find({type});
    cxt.response.body = {code: 0, data: result};
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