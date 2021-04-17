/*
 * @Author: linzq
 * @Date: 2020-11-25 10:02:48
 * @LastEditors: linzq
 * @LastEditTime: 2021-04-16 15:40:35
 * @Description: swagger配置
 */
const router = require('koa-router')(); // 引入路由函数
const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
  info: {
    description:
      'This is a sample server Koa2 server.  You can find out more about     Swagger at [http://swagger.io](http://swagger.io) or on [irc.freenode.net, #swagger](http://swagger.io/irc/).',
    version: '1.0.0',
    title: 'Koa2_server Swagger',
    // 服务条款
    // termsOfService: 'http://swagger.io/terms/',
    contact: {
      name: 'Contact developers',
      url: 'https://mail.qq.com/',
      email: '741167479@qq.com'
    },
    // 开源协议
    license: {
      name: 'Apache 2.0',
      url: 'http://www.apache.org/licenses/LICENSE-2.0.html'
    }
  },
  host: global.config.NODE_ENV === 'development' ? 'localhost:4000' : 'localhost:4000',
  basePath: '/', // Base path (optional), host/basePath
  schemes: ['http', 'https'],
  securityDefinitions: {
    // TODO：不知道怎么用，等整明白了再说
    // server_auth: {
    //   type: 'oauth2',
    //   description: '描述',
    //   tokenUrl: 'http://localhost:4000/common/oauth',
    //   flow: 'password',
    //   scopes: {
    //     oauth2_token: 'modify pets in your account'
    //   }
    // },
    token: {
      description: `超级账号：dfcdb53df37919daf1825d2cbb86abfe27f9206f8cf119caa5770717bab4d0
        7bcc61988e1f9e88fa9b45232410c4369ed8510984b658497d31e0731fd56a906d13d4a22e2ffc6d230
        3bdfe1a54b8c97396b4a249c646576aa0a24d46288dbb1a4dae38929b0a151d8e35465c1b383056d779
        c3044d05d4b56296572128b53bf10375e34aeb967c8c908800154e04c759b218feb94ef9be65425d159
        6d4e2d6d121ff4138bb79010e56a5d8ffcf24be2c6a310156b8e109bc78a9e8653c7231a044191e4940
        2f112cf90bb6cd6ae98356a405f66df1bcb4369169c10e24dd2ca6`,
      type: 'apiKey',
      name: 'token',
      in: 'header'
    }
  },
  components: {
    description: {
      description: '登入成功'
    }
  },
  definitions: {
    Order: {
      type: 'object',
      properties: {
        id: {
          type: 'integer',
          format: 'int64'
        },
        petId: {
          type: 'integer',
          format: 'int64'
        },
        quantity: {
          type: 'integer',
          format: 'int32'
        },
        shipDate: {
          type: 'string',
          format: 'date-time'
        },
        status: {
          description: '状态',
          type: 'string',
          enum: '',
          0: 'placed',
          1: 'approved',
          2: 'delivered'
        },
        complete: {
          type: 'boolean',
          default: false
        }
      },
      xml: {
        name: 'Order'
      }
    }
  }
};
const options = {
  swaggerDefinition,
  // 写有注解的router的存放地址
  apis: ['./routes/*.js', './routes/image/*.js', './routes/*/*.js'] // routes下所有的js文件和routes/image下所有js文件
};
const swaggerSpec = swaggerJSDoc(options);
// 通过路由获取生成的注解文件
router.get('/swagger.json', async ctx => {
  ctx.set('Content-Type', 'application/json'); // , application/x-www-form-urlencoded
  ctx.body = swaggerSpec;
});

module.exports = router;
// 将页面暴露出去
