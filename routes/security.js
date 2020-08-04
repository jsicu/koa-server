const mysql = require('../mysql');
const router = require('koa-router')();
const paramCheck = require('../utils/paramCheck');
const Joi = require('joi'); // 参数校验

const NodeRSA = require('node-rsa'); // rsa加密
const key = new NodeRSA({ b: 512 });
key.setOptions({ encryptionScheme: 'pkcs1' });

router.prefix('/security');

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
router.post('/login', async (ctx, next) => {
  const requestParam = ['name', 'password'];
  const user = ctx.request.body;
  console.log(user);
  if (paramCheck.check(user, requestParam) !== true) {
    ctx.error([0, paramCheck.check(user, requestParam)]);
  } else {
    const password = user.password.replace(/\s+/g, '+'); // 防止公钥有空格存在
    user.password = key.decrypt(password, 'utf8'); // 解密
    // eslint-disable-next-line quotes
    const sql = "select * from `user` where `name`='" + user.name + "' and `password`='" + user.password + "'";
    const result = await mysql.query(sql);
    if (result[0] && result[0].is_cancel === 0) {
      const tk = ctx.getToken({ name: result[0].name, id: result[0].id }); // token中要携带的信息，自己定义
      ctx.success({
        id: result[0].id,
        token: tk
      });
    } else {
      ctx.error([0, '用户名或密码错误']);
    }
  }
});

/**
 * @swagger
 * /security/publicKey:
 *   get:
 *     description: 获取加密公钥
 *     tags: [用户鉴权模块]
 *     responses:
 *       200:
 *         description: 获取成功
 */
// 加密公钥获取
router.get('/publicKey', async (ctx, next) => {
  const publicKey = key.exportKey('public'); // 生成公钥
  ctx.success(publicKey);
});

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
 *       200:
 *         description: 退出成功
 */
router.post('/logout', async (ctx, next) => {
  const decryptTk = ctx.decryptToken(ctx.request.header.token);
  const sql = `DELETE FROM online_token WHERE token = '${decryptTk}'`;
  const result = await mysql.query(sql);
  if (result.affectedRows === 1) {
    ctx.success(true);
  } else {
    ctx.error([0, '退出失败！']);
  }
});

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
 */
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

/**
 *
 * /security/register:
 *   post:
 *     description: 注册
 *     tags: [用户鉴权模块]
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: email
 *         description: 邮箱
 *         required: true
 *         in: formData
 *         type: string
 *       - name: name
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
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: 获取成功
 */
// 未开发
router.post('/register', async (ctx, next) => {
  console.log(ctx.session);
  ctx.success(ctx.session.emailCode);
});

module.exports = router;
