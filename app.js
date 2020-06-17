const Koa = require('koa');
const app = new Koa();
const views = require('koa-views');
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser');
const logger = require('koa-logger');
const cors = require('koa2-cors'); // 跨域中间件
// const response = require('koa2-response'); // 响应实体

const index = require('./routes/index');
const users = require('./routes/users');
const security = require('./routes/security');
const response = require('./middleware/response');

// error handler
onerror(app);

// middlewares
app.use(
  bodyparser({
    enableTypes: ['json', 'form', 'text']
  })
);
app.use(json());
app.use(logger());
// 设置允许跨域访问该服务.
app.use(cors());
app.use(require('koa-static')(__dirname + '/public'));
app.use(response); // 返回体

app.use(
  views(__dirname + '/views', {
    extension: 'pug'
  })
);

// logger
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

// routes
app.use(index.routes(), index.allowedMethods());
app.use(users.routes(), users.allowedMethods());
app.use(security.routes(), security.allowedMethods());

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx);
});

module.exports = app;
