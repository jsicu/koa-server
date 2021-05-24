const Koa = require('koa');
const app = new Koa();
const views = require('koa-views');
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser');
const logger = require('koa-logger');
const cors = require('koa2-cors'); // 跨域中间件
const koaSwagger = require('koa2-swagger-ui');
const jwt = require('jsonwebtoken');
require('module-alias/register'); // 路径别名

// 路由
const InitManager = require('./core/init');
InitManager.loadConfig(); // 全局配置

// 中间件
const errorHandler = require('./middleware/errorHandler');
const response = require('./middleware/response');
const token = require('./middleware/token');
const myLog = require('./middleware/log');
const validate = require('./middleware/validate');
const httpProxy = require('./middleware/httpProxy');
const utils = require('./middleware');

// 公告方法
const logsUtil = require('./utils/logs.js'); // 日志文件

let ms = 0; // 接口耗时
// swagger配置
const swagger = require('./config/swagger');
app.use(swagger.routes(), swagger.allowedMethods());
// 生产环境取消swagger
if (global.config.NODE_ENV === 'development') {
  app.use(
    koaSwagger({
      routePrefix: '/swagger', // host at /swagger instead of default /docs
      swaggerOptions: {
        url: '/swagger.json' // example path to json
      }
    })
  );
}

// error handler
onerror(app);

app.use(
  bodyparser({
    enableTypes: ['json', 'form', 'text']
  })
);

app.use(errorHandler); // 统一错误异常处理
app.use(validate); // 验证
app.use(response); // 返回体中间件
app.use(
  cors({
    // origin: function (ctx) {
    //   if (ctx.url === '/test') {
    //     return '*'; // 允许来自所有域名请求
    //   }
    //   return 'http://localhost:3999'; // 这样就能只允许 http://localhost:8080 这个域名的请求了
    // },
    exposeHeaders: ['Authorization']
    // maxAge: 3600,
    // credentials: true,
    // allowMethods: ['GET', 'POST', 'DELETE', 'PUT'],
    // allowHeaders: ['refresh_token', 'token']
  })
); // 设置允许跨域访问该服务.
// app.use(cors()); // 设置允许跨域访问该服务.
app.use(token); // token
app.use(myLog); // 日志中间件
app.use(json());
app.use(logger());
app.use(require('koa-static')(__dirname + '/public')); // 静态资源
app.use(utils); // 公共方法
// apiHost即是你要转发请求到后端的host，其他的参数可以参考axioshttps://github.com/axios/axios
// 请求转发中间件，暂时只支持转发到另一个地址
// TODO: 支持多转发
app.use(
  httpProxy({
    apiHost: 'localhost:3000' // 全局端口
  })
);

// 权限认证
app.use(async (ctx, next) => {
  // 权限白名单 POSTMAN SWAGGER
  const POSTMAN = ctx.request.header['user-agent'].slice(0, 7);
  const url = ctx.path;
  // eslint-disable-next-line dot-notation
  // const SWAGGER = ctx.request.header['referer'].slice(-7);

  if (POSTMAN === 'Postman' && global.config.NODE_ENV === 'development') {
    // 请求转发，服务代理
    // http://xxx:4000/nest/xx的请求会转发到http://xxx:3000/nest/xx
    if (url.startsWith('/nest')) {
      const data = await ctx.httpProxy({
        host: 'localhost:3000' // 多代理，nest地址代理到localhost:3000
      });
      // 这里可以做一些请求之后需要处理的事情
      ctx.body = data;
    } else if (url.startsWith('/test')) {
      const data = await ctx.httpProxy({
        host: 'localhost:3000', // 多代理，nest地址代理到localhost:3000
        url: '/nest/schedule'
      });
      // 这里可以做一些请求之后需要处理的事情
      ctx.body = data;
    }
    // postman只能访问开发环境的服务
    await next();
  } else {
    // 白名单接口
    const WHITELIST = ['/security/publicKey', '/security/login', '/security/logOut', '/index']; //, '/common'
    if (!WHITELIST.some(element => element === url)) {
      const headerToken = ctx.request.header.token;
      const queryToken = ctx.query.token;
      if (headerToken || queryToken) {
        if (!ctx.checkToken(headerToken || queryToken)) {
          return ctx.error([401, '令牌已过期！']);
        }
      } else {
        return ctx.error([401, 'token检验未通过！']);
      }
    }

    // 请求转发，服务代理
    // http://xxx:4000/nest/xx的请求会转发到http://xxx:3000/nest/xx
    if (url.startsWith('/nest')) {
      const data = await ctx.httpProxy({
        host: 'localhost:3000' // 多代理，nest地址代理到localhost:3000
      });
      // 这里可以做一些请求之后需要处理的事情
      ctx.body = data;
    }
    await next();
  }
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
  if (global.config.NODE_ENV === 'development') {
    logsUtil.logResponse(ctx, ms); // 记录响应日志, 生产环境不输出，减少硬盘使用
  }
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

// 路由注册
InitManager.initCore(app);

module.exports = app;
