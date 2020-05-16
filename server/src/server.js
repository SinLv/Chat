const Koa = require('koa');
const app = new Koa();
const path = require('path');
const routers = require('./routers');
const koaBody = require('koa-body');
const model = require('./model');
const Chat = model.getModel('chat');
//绑定koa与scoket.io
const server = require('http').createServer(app.callback());
const io = require('socket.io')(server);

// io的监听
io.on('connection', function (socket) {
    console.log('socket.io is connect');
    // 监听请求，获取发送的消息
    socket.on('sendmsg', function (data) {
        console.log(data);
        // 将接收到的消息发送到全局
        const {from, to, msg} = data;
        const chatid = [from, to].sort().join('_');
        // 将聊天信息存到数据库中，然后转发出去
        Chat.create({chatid, from, to, content: msg}, function (err, doc) {
            console.log(doc);
            io.emit('recvmsg', Object.assign({}, doc._doc))
        });
    });
});

app.use(koaBody());
// 最外层错误捕获中间件
const errCatch = async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        ctx.response.status = err.statusCode || err.status || 500;
        ctx.response.body = {
            message: err.message
        }
    }
}
app.use(errCatch);
// 启动路由
app.use(routers.routes());
app.use(routers.allowedMethods());

server.listen(9093, function () {
    console.log('start 9093');
});