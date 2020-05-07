const Koa = require('koa');
const app = new Koa();
const route = require('koa-route');
const path = require('path');
const koaBody = require('koa-body');

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

app.listen(9093, function () {
    console.log('start 9093');
});