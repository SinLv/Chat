const Koa = require('koa');
const app = new Koa();
const path = require('path');
const routers = require('./routers');
const koaBody = require('koa-body');
const model = require('./model');

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

app.listen(9093, function () {
    console.log('start 9093');
});