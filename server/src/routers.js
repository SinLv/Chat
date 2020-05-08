const Route = require('koa-router');
const routes = new Route();

routes.post('/user/login', (ctx, next) => {
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

module.exports = routes;