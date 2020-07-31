const Koa = require('koa');
const app = new Koa();
const views = require('koa-views');
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser');
const logger = require('koa-logger');
const cors = require('koa2-cors'); // 跨域中间件
const session = require('koa-session');
const koaSwagger = require('koa2-swagger-ui');

const index = require('./routes/index');
const users = require('./routes/users');
const security = require('./routes/security');
const response = require('./middleware/response');
const token = require('./middleware/token');
const mysql = require('./mysql');
// const logsUtil = require('./utils/logs.js'); // 日志文件

// swagger配置
const swagger = require('./config/swagger');
app.use(swagger.routes(), swagger.allowedMethods());
app.use(
  koaSwagger({
    routePrefix: '/swagger', // host at /swagger instead of default /docs
    swaggerOptions: {
      url: '/swagger.json' // example path to json
    }
  })
);

// 使用session
// app.keys = ['secret'];
// const { sessionConfig } = require('./config/config');
// app.use(session(sessionConfig, app));

// error handler
onerror(app);

/*  middlewares */

// 统一错误异常处理
// const errorHandler = require('./middleware/errorHandler');
// errorHandler(app);

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
app.use(token); // token

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
  logsUtil.logResponse(ctx, ms); // 记录响应日志
  // 日志白名单
  // const whiteList = ['/security/login', '/security/email-verify', '/security/publicKey']
  // if (whiteList.includes(ctx.request.url)) {

  // }
  // const referer = ctx.request.header.referer || ctx.request.header['user-agent'];
  // const decryptTk = ctx.decryptRSAToken(ctx.request.header.token);
  // console.log(ctx.request);
  // console.log(ctx.request.header['user-agent']);
  // console.log(referer);
  // const sql = `INSERT INTO online_token (token) VALUES ('${token}')`; // 存入token
  // mysql.query(sql);
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

// routes
app.use(index.routes(), index.allowedMethods());
app.use(users.routes(), users.allowedMethods());
app.use(security.routes(), security.allowedMethods());

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx);
  // logsUtil.logError(ctx, err, 123); // 记录异常日志
});

module.exports = app;
