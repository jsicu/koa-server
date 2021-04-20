const router = require('koa-router')();
const paramCheck = require('../utils/paramCheck');
const Joi = require('joi'); // 参数校验
const fs = require('fs'); // 引入fs模块
const crypto = require('crypto'); // 引入fs模块
const http = require('http');
const models = require('@db/index');

const { v1 } = require('uuid'); // uuid生成

// const NodeRSA = require('node-rsa'); // rsa加密
// const key = new NodeRSA({ b: 512 });
// key.setOptions({ encryptionScheme: 'pkcs1' });
const { key } = require('../utils/encryption');

router.prefix('/security');

// #region
/**
 * @swagger
 * /security/login:
 *   post:
 *     description: 用户登入
 *     tags: [用户鉴权模块]
 *     produces:
 *       - application/x-www-form-urlencoded
 *     parameters:
 *       - name: password
 *         description: 用户密码
 *         in: formData
 *         required: true
 *         type: string
 *       - name: name
 *         description: 用户名
 *         in: formData
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: 登入成功
 */
// #endregion
router.post('/login', async (ctx, next) => {
  const data = ctx.request.body;
  const pw = data.password.replace(/\s+/g, '+'); // 防止公钥有空格存在
  data.password = key.decrypt(pw, 'utf8'); // 解密
  const schema = Joi.object({
    userName: ctx.joiRequired('用户名称'),
    password: ctx.joiRequired('账号密码')
  });
  const { userName, password } = data;
  let required = { userName, password };
  const value = schema.validate(required);

  if (value.error) throw new global.err.ParamError(value.error.message);

  // 加密
  const hmac = crypto.createHmac('sha256', required.userName);
  hmac.update(required.password);
  required.password = hmac.digest('hex');
  required = { ...required, isCancel: 0 };
  const res = await models.user.findAll({
    where: required
  });
  let loginSuccess = false;
  if (res.length > 0) {
    loginSuccess = true;
    const tk = ctx.getToken({ name: res[0].userName, id: res[0].id }, global.config.refreshTime); // token中要携带的信息，自己定义
    const refreshTk = ctx.getToken({ name: res[0].userName, id: res[0].id }, '1d'); // token中要携带的信息，自己定义
    ctx.success({
      id: res[0].id,
      token: tk,
      refreshToken: refreshTk
    });
    models.log.create({
      type: 1,
      token: tk,
      originalUrl: ctx.request.originalUrl,
      ip: ctx.request.ip,
      userId: res[0].id
    });
  } else {
    ctx.error([0, '用户名或密码错误']);
  }

  // ip所在地查询
  if (loginSuccess) {
    const ip = ctx.request.ip.substr(ctx.request.ip.lastIndexOf(':') + 1);
    const APIServer = 'http://api.map.baidu.com/location/ip?ak=vxvdMjDXHROfGQnyYCzv4MoXrkEqDBYX&coor=bd09ll&ip=';
    const url = APIServer + ip;
    http.get(url, res => {
      const code = res.statusCode;
      if (code == 200) {
        res.on('data', async data => {
          try {
            const content = JSON.parse(data).content;
            models.log.update(
              { address: content?.address, point: JSON.stringify(content?.point) },
              { where: { ip: ctx.request.ip } }
            );
          } catch (err) {
            console.log(err);
          }
        });
      }
    });
  }
});

// 加密公钥获取
// #region
/**
 * @swagger
 * /security/publicKey:
 *   get:
 *     description: 获取加密公钥
 *     tags: [用户鉴权模块]
 *     responses:
 *       '200':
 *         description: Ok
 *         schema:
 *           type: 'object'
 *           properties:
 *             code:
 *               type: 'number'
 *               description: 状态码
 *             data:
 *               type: 'string'
 *               description: 加密公钥
 *             message:
 *               type: 'string'
 *               description: 消息提示
 *       '400':
 *         description: 请求参数错误
 *       '404':
 *         description: not found
 *    # security:
 *    #   - token: {}
 *    #   - server_auth:
 *    #     - token
 */
// #endregion
router.get('/publicKey', async (ctx, next) => {
  const publicKey = key.exportKey('public'); // 生成公钥
  ctx.success(publicKey);
});

// #region
/**
 * @swagger
 * /security/logout:
 *   post:
 *     description: 退出
 *     tags: [用户鉴权模块]
 *     produces:
 *       - application/json
 *     parameters:
 *       -name:
 *        description:
 *        in: query
 *        type: string
 *     responses:
 *       '200':
 *         description: Ok
 *         schema:
 *           type: 'object'
 *           properties:
 *             code:
 *               type: 'number'
 *             data:
 *               type: 'object'
 *               description: 返回数据
 *             message:
 *               type: 'string'
 *               description: 消息提示
 *       '400':
 *         description: 请求参数错误
 *       '404':
 *         description: not found
 *     security:
 *       - token: []
 */
// #endregion
router.post('/logout', async (ctx, next) => {
  const decryptTk = ctx.decryptToken(ctx.request.header.token);
  models.onlineToken.destroy({ where: { token: decryptTk } });
  ctx.success(true);
});

// #region
/**
 * @swagger
 * /security/email-verify:
 *   post:
 *     description: 邮箱验证
 *     tags: [用户鉴权模块]
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: email
 *         description: 邮箱
 *         required: true
 *         in: formData
 *         type: string
 *     responses:
 *       200:
 *         description: 获取成功
 *     security:
 *       - token: {}
 */
// #endregion
const { Email } = require('../config/nodemailer');
const assert = require('assert').strict;

router.post('/email-verify', async (ctx, next) => {
  console.log(ctx.session.emailCode);
  const email = ctx.request.body.email; // 前端发送来的邮箱
  const schema = Joi.object({
    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
      .required()
      .error(new Error(true))
  });
  const value = schema.validate({ email });
  if (value !== true) return ctx.error([400, '邮箱不合法!']);

  const mailOptions = {
    // 发送给用户显示的字段
    from: '741167479@qq.com',
    to: email,
    subject: '账号注册邮箱验证码',
    text: '验证码：' + Email.verify
  };
  const info = await Email.transporter.sendMail(mailOptions);
  if (info) {
    ctx.session.emailCode = Email.verify;
    ctx.success('验证码发送成功！');
  } else {
    ctx.error([0, '邮箱验证失败！']);
  }
});

// 注册接口
// #region
/**
 * @swagger
 * /security/register:
 *   post:
 *     description: 注册
 *     tags: [用户鉴权模块]
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: email
 *         description: 邮箱
 *         required: false
 *         in: formData
 *         type: string
 *       - name: userName
 *         description: 用户名
 *         in: formData
 *         required: true
 *         type: string
 *       - name: password
 *         description: 用户密码
 *         in: formData
 *         required: true
 *         type: string
 *       - name: code
 *         description: 邮箱验证码
 *         in: formData
 *         required: false
 *         type: string
 *     responses:
 *       200:
 *         description: 获取成功
 */
// #endregion
router.post('/register', async (ctx, next) => {
  const data = ctx.request.body;
  // 如果注册有加密
  // const password = data.password.replace(/\s+/g, '+'); // 防止公钥有空格存在
  // data.password = key.decrypt(password, 'utf8'); // 解密
  const schema = Joi.object({
    userName: ctx.joiRequired('用户名称'),
    password: ctx.joiRequired('用户密码')
  });
  const { userName, password } = data;
  const required = { userName, password };
  const value = schema.validate(required);
  if (value.error) throw new global.err.ParamError(value.error.message);

  const hmac = crypto.createHmac('sha256', required.userName);
  hmac.update(required.password);
  required.password = hmac.digest('hex');

  models.user.create(required);
  ctx.success(true);
});

module.exports = router;
