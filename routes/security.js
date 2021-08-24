const router = require('koa-router')();
const Table = require('root/core/tableList');
const Joi = require('joi'); // 参数校验
const fs = require('fs'); // 引入fs模块
const crypto = require('crypto'); // 引入fs模块
const http = require('http');
const models = require('@db/index');
const redis = require('@redis');
const { Op } = require('sequelize');

const { v4 } = require('uuid'); // uuid生成
const expiryTime = 60; // 验证码有限期单位：S

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
  required = { ...required, isCancel: 1 };
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
 *     description: 邮箱验证-获取验证码
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
  const email = ctx.request.body.email; // 前端发送来的邮箱
  const type = ctx.request.body.type; // 验证码类型：修改密码或者注册
  const schema = Joi.object({
    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
      .required()
      .error(new Error(true))
  });
  const value = schema.validate({ email });
  if (value.error) return ctx.error([400, '邮箱不合法!']);

  // 重复获取
  const countDown = await redis.getString(`countDown_${ctx.request.ip}`);
  if (countDown) {
    const time = (expiryTime - (new Date().getTime() - countDown) / 1000).toFixed(0);
    if (time > 0) {
      return ctx.success(`${time}秒后再获取`);
    }
  }

  const emailCode = Email.verify; // 验证码

  const emailContent = {
    title: 'jsICU---邮箱验证码',
    body: `
      <h3>您好：</h3>
      <div style="font-size: 14px;color:#000;">
          <p style="margin: 0">您的验证码为： <span style="font-size: 16px;color:#f00;"> ${emailCode}， </span></p>
          <p style="margin: 0">您当前正在jsICU案例管理平台${
            !type ? '注册账号' : '修改密码'
          }，验证码告知他人将会导致数据信息被盗，请勿泄露。</p>
          <p style="margin: 0">如非本人操作，请忽略！</p>
          <p style="color:#999; margin: 0">60秒内有效</p>
      </div>
      `
  };
  // const mailOptions = {
  //   // 发送给用户显示的字段
  //   from: 'jsicu@qq.com',
  //   to: email,
  //   subject: emailContent.title,
  //   html: emailContent.body
  // };
  // const info = await Email.transporter.sendMail(mailOptions);
  // console.log(info);
  redis.setString(email, emailCode, expiryTime);
  redis.setString(`countDown_${ctx.request.ip}`, new Date().getTime(), expiryTime);

  // if (info) {
  //   // ctx.session.emailCode = Email.verify;
  ctx.success(`验证码发送成功！${emailCode}`);
  // } else {
  //   ctx.error([0, '邮箱验证失败！']);
  // }
});

// 注册接口
// #region
/**
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
  // 如果注册有rsa加密
  // const password = data.password.replace(/\s+/g, '+'); // 防止公钥有空格存在
  // data.password = key.decrypt(password, 'utf8'); // 解密
  const schema = Joi.object({
    userName: ctx.joiRequired('用户名称'),
    password: ctx.joiRequired('用户密码'),
    mailbox: ctx.joiRequired('注册邮箱'),
    power: ctx.joiRequired('账号权限'),
    code: ctx.joiRequired('验证码')
  });
  const { userName, password, mailbox, power, code, isCancel } = data;
  let required = { userName, password, mailbox, power, code };
  const value = schema.validate(required);
  if (value.error) throw new global.err.ParamError(value.error.message);

  // 前端简易加密，后端直接保存
  // const hmac = crypto.createHmac('sha256', required.userName);
  // hmac.update(required.password);
  // required.password = hmac.digest('hex');

  const redisCode = await redis.getString(mailbox);
  if (redisCode != code) return ctx.error([0, '验证码错误！']);

  const [user, created] = await models.user.findOrCreate({
    attributes: ['userName', 'mailbox', 'createTime'],
    where: { [Op.or]: [{ mailbox: { [Op.substring]: mailbox } }, { userName: { [Op.substring]: userName } }] },
    defaults: {
      userName,
      password,
      mailbox,
      power,
      id: v4(),
      isCancel: isCancel || 1
    }
  });

  if (created) {
    ctx.success(true);
  } else {
    if (user.userName === userName) return ctx.error([0, '该用户已存在，如需找回请点击忘记密码！']);
    if (user.mailbox === mailbox) return ctx.error([0, '该邮箱已绑定其他用户！']);
  }
});

// 获取倒计时
router.get('/countDown', async (ctx, next) => {
  const countDown = await redis.getString(`countDown_${ctx.request.ip}`);
  if (countDown) {
    const time = expiryTime - (new Date().getTime() - countDown) / 1000;
    ctx.success(time.toFixed(0));
  } else {
    ctx.success('');
  }
});

// 账号详情,对内
router.post('/account', async (ctx, next) => {
  const data = ctx.request.body;
  const schema = Joi.object({
    id: ctx.joiRequired('账号id')
  });
  const { id } = data;
  const required = { id };
  const value = schema.validate(required);
  if (value.error) throw new global.err.ParamError(value.error.message);
  const { count, rows } = await models.user.findAndCountAll({
    attributes: ['id', 'userName', 'mailbox', 'isCancel', 'createTime', 'power'],
    where: { id: { [Op.substring]: id } }
  });
  rows[0].power = rows[0].power.split(',');
  ctx.success(Table.tableTotal(count, rows));
});

// 修改账户信息
router.put('/account', async (ctx, next) => {
  const data = ctx.request.body;
  const schema = Joi.object({
    userName: ctx.joiRequired('用户名称'),
    mailbox: ctx.joiRequired('注册邮箱'),
    power: ctx.joiRequired('账号权限')
  });
  const { userName, password, mailbox, power, code, isCancel, id } = data;
  let required = { userName, mailbox, power };
  const value = schema.validate(required);
  if (value.error) throw new global.err.ParamError(value.error.message);

  // 如果修改邮箱
  if (code) {
    const redisCode = await redis.getString(mailbox);
    if (redisCode != code) return ctx.error([0, '验证码错误！']);
    const { count: countMailbox } = await models.user.findAndCountAll({
      attributes: ['mailbox', 'createTime'],
      where: { mailbox: { [Op.substring]: mailbox } }
    });
    if (countMailbox > 0) return ctx.error([0, '该邮箱已绑定其他用户！']);
  }

  required = {
    userName,
    mailbox,
    power,
    isCancel: isCancel || 1
  };
  if (password) required.password = password;

  await models.user
    .update(required, { where: { id } })
    .then(result => {
      ctx.success(true);
    })
    .catch(err => {
      ctx.errorLog('sql查询报错', err);
      ctx.error([0, err.errors[0].message]);
    });
});

// 对比密码
router.post('/comparePassword', async (ctx, next) => {
  const data = ctx.request.body;
  const schema = Joi.object({
    password: ctx.joiRequired('账户密码')
  });
  const { password, id } = data;
  const required = { password };
  const value = schema.validate(required);
  if (value.error) throw new global.err.ParamError(value.error.message);

  const { count } = await models.user.findAndCountAll({
    attributes: ['id', 'createTime'],
    where: { id, password }
  });
  if (count > 0) {
    return ctx.success(false);
  } else {
    return ctx.success(true);
  }
});

module.exports = router;
