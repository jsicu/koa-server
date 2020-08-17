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
const security = require('./routes/security'); // 登陆认证
const image = require('./routes/image'); // 图片处理

const response = require('./middleware/response');
const token = require('./middleware/token');
const utils = require('./utils');
const mysql = require('./mysql');
const logsUtil = require('./utils/logs.js'); // 日志文件

let ms = 0; // 接口耗时
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

// 权限认证
// app.use(async (ctx, next) => {
//   console.log(ctx);
//   await next();
// });

app.use(json());
app.use(logger());
app.use(cors()); // 设置允许跨域访问该服务.
app.use(require('koa-static')(__dirname + '/public')); // 静态资源
app.use(response); // 返回体
app.use(token); // token
app.use(utils); // 公共方法

app.use(
  views(__dirname + '/views', {
    extension: 'pug'
  })
);

// logger
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  ms = new Date() - start;
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
app.use(image.routes(), image.allowedMethods());

// error-handling
app.on('error', (err, ctx) => {
  // console.error('server error', err, ctx);
  logsUtil.logError(ctx, err, ms); // 记录异常日志
  ctx.error([0, err]);
});

module.exports = app;
