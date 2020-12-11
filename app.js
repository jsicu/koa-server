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

// 路由
const index = require('./routes/index');
const commom = require('./routes/commom'); // 通用服务
const security = require('./routes/security'); // 登陆认证
const image = require('./routes/image'); // 图片处理

// 中间件
const response = require('./middleware/response');
const token = require('./middleware/token');
const myLog = require('./middleware/log');
const utils = require('./middleware');

// 公告方法
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

app.use(response); // 返回体中间件
app.use(cors()); // 设置允许跨域访问该服务.
app.use(token); // token
app.use(myLog); // 日志中间件
app.use(json());
app.use(logger());
app.use(require('koa-static')(__dirname + '/public')); // 静态资源
app.use(utils); // 公共方法

// 权限认证
app.use(async (ctx, next) => {
  // 权限白名单 POSTMAN SWAGGER
  const POSTMAN = ctx.request.header['user-agent'].slice(0, 7);
  // eslint-disable-next-line dot-notation
  const SWAGGER = ctx.request.header['referer'].slice(-7);
  if (POSTMAN === 'Postman' || SWAGGER === 'swagger') {
  } else {
    // 白名单接口
    const WHITELIST = ['/security/publicKey', '/security/login'];
    if (!WHITELIST.some(element => element === ctx.request.url)) {
      const headerToken = ctx.request.header.token;
      const queryToken = ctx.query.token;
      if (headerToken || queryToken) {
        if (headerToken && !ctx.checkToken(headerToken)) {
          return ctx.error([0, '令牌已过期！']);
        }
        if (queryToken && !ctx.checkToken(queryToken)) {
          return ctx.error([0, '令牌已过期！']);
        }
      } else {
        return ctx.error([0, 'token检验未通过！']);
      }
    }
  }
  await next();
});

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
app.use(commom.routes(), commom.allowedMethods());
app.use(security.routes(), security.allowedMethods());
app.use(image.routes(), image.allowedMethods());

// error-handling
app.on('error', (err, ctx) => {
  // console.error('server error', err, ctx);
  logsUtil.logError(ctx, err, ms); // 记录异常日志
  ctx.error([0, err]);
});

module.exports = app;
