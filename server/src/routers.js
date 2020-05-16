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
}).get('/user/list', async (ctx, next) => {
    const {type} = ctx.request.query;
    console.log(type);
    let result = await User.find({type});
    ctx.response.body = {code: 0, data: result};
    next();
}).get('/user/getmsglist', async (ctx, next) => {
    const user = ctx.cookies.get('userid');
    // 先查詢所有的消息列表
    let userdoc = await User.find({});
    let users = {};
    userdoc.forEach(v => {
        // 获取用户的名称和头像
        users[v._id] = {name: v.user, avatar:v.avatar}
    });
    // 查询当前用户所有的发出和收到信息
    let doc = await Chat.find({'$or': [{from: user, to: user}]});
    if (!doc) {
        ctx.response.body = {code: 0, msgs: doc, users:users};
    } else {
        ctx.response.body = {code: 0, msgs: [], users:users};
    }
    next();
}).post('/user/readmsg', async (ctx, next) => {
    //将未读信息修改为已读
    const userid = ctx.cookies.get('userid');
    const {from} = ctx.request.body;
    let doc = await Chat.update(
        {from, to: userid},
        {'$set': {read: true}},
        {'multi':true},
    );
    console.log("user-->readmsg",doc)
    ctx.response.body = {code:0,num:doc.nModified};
    next();
}).get('/user/info', async (ctx, next) => {
    const userid = ctx.cookies.get('userid');
    if (!userid) {
        ctx.response.body = {code:1};
    }
    let doc = await User.findOne({id: userid}, _filter);
    if (doc) {
        ctx.response.body = {code:0,data:doc};
    } else {
        ctx.response.body = {code:1};
    }
    next();
});

function md5Pwd(pwd){
    const salt = 'th_is_good546dsadfdgr!@#~33'
    return utils.md5(utils.md5(pwd+salt))
}

module.exports = routes;