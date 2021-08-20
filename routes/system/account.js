/*
 * @Author: linzq
 * @Date: 2020-11-25 10:02:48
 * @LastEditors: linzq
 * @LastEditTime: 2021-04-19 18:42:42
 * @Description: 账号管理模块
 */
const Table = require('root/core/tableList');
const router = require('koa-router')();
const path = require('path');
const Joi = require('joi'); // 参数校验
const fs = require('fs');
const models = require('@db/index');
const { Op } = require('sequelize');

const seq = require('@db/db');

router.prefix('/account');

const code = {
  UNKNOWN_ERROR: [0, 'Sorry, you seem to have encountered some unknown errors.']
};
const pwdPath = path.resolve(__dirname);

// #region
/**
 * @swagger
 * /account/list:
 *   get:
 *     summary: 账号列表
 *     description: 账号列表
 *     tags: [系统管理模块]
 *     parameters:
 *       - name: pageNum
 *         description: 页码
 *         in: formData
 *         type: number
 *       - name: pageSize
 *         description: 条数
 *         in: formData
 *         type: number
 *       - name: userName
 *         description: 用户名
 *         in: formData
 *         type: string
 *       - name: isCancel
 *         description: 状态
 *         in: formData
 *         type: number
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
 *       - token: {}
 */
// #endregion
router.get('/list', async (ctx, next) => {
  const data = ctx.request.query;
  const schema = Joi.object({
    pageNum: ctx.joiRequired('pageNum'),
    pageSize: ctx.joiRequired('pageSize'),
    userName: ctx.joiReplaceSpace(),
    isCancel: ctx.joiReplace()
  });
  const { pageNum, pageSize, userName, isCancel } = data;
  let required = { pageNum, pageSize, userName, isCancel };
  const value = await schema.validate(required);
  if (value.error) throw new global.err.ParamError(value.error.message);
  required = value.value;

  delete required.pageNum;
  delete required.pageSize;
  const search = {};
  for (const i in required) {
    if (required[i]) {
      search[i] = { [Op.substring]: required[i] };
    }
  }
  const { count, rows } = await models.user.findAndCountAll({
    attributes: ['id', 'userName', 'password', 'mailbox', 'isCancel', 'createTime'],
    offset: (pageNum - 1) * pageSize,
    limit: pageSize - 0,
    where: search
  });
  ctx.success(Table.tableTotal(count, rows));
});

// 字典获取
// #region
/**
 * @swagger
 * /common/getAll:
 *   get:
 *     description: 字典
 *     tags: [公共模块]
 *     produces:
 *       - application/x-www-form-urlencoded
 *     responses:
 *       200:
 *         description: 登入成功
 */
// #endregion
router.get('/getAll', async (ctx, next) => {
  const url = path.join(path.resolve(), 'static/dataCache/dict.json');
  if (ctx.checkPath(url)) {
    const data = JSON.parse(fs.readFileSync(url, 'utf-8'));
    ctx.success(data);
  } else {
    // const ids = await seq.query('SELECT DISTINCT dict_id from dictionary;');
    let ids = await models.dictionary.findAll({
      attributes: ['dictId'],
      group: 'dictId'
    });
    const res = JSON.parse(
      JSON.stringify(
        await models.dictionary.findAll({
          attributes: ['dictId', 'label', 'value']
        })
      )
    );
    ids = JSON.parse(JSON.stringify(ids));
    const result = {};
    for (const iterator of ids) {
      result[String(iterator.dictId)] = [];
      for (let i = res.length - 1; i >= 0; i--) {
        const element = res[i];
        if (iterator.dictId == element.dictId) {
          result[String(iterator.dictId)].push(element);
          res.splice(i, 1);
        }
      }
    }
    ctx.success(result);

    fs.writeFile(url, JSON.stringify(result), err => {
      if (err) throw err;
      console.log('文件已被保存');
    });
  }
});

// oauth2授权服务
// #region
/**
 * @swagger
 * /common/oauth:
 *   post:
 *     description: 字典
 *     tags: [公共模块]
 *     produces:
 *       - application/x-www-form-urlencoded
 *       - application/json
 *     responses:
 *       200:
 *         description: 登入成功
 *     security:
 *       - token: []
 */
// #endregion
router.post('/oauth', (ctx, next) => {
  console.log(ctx.request.body);
  ctx.success({
    access_token: '36034ff7-7eea-4935-a3b7-5787d7a65827',
    token_type: 'bearer',
    grant_type: 'password',
    refresh_token: '4baea735-3c0d-4dfd-b826-91c6772a0962',
    expires_in: 36931,
    scope: 'token'
  });
});

// 测试
// #region
/**
 * @swagger
 * /common/test:
 *   get:
 *     description: 字典
 *     tags: [公共模块]
 *     produces:
 *       - application/x-www-form-urlencoded
 *       - application/json
 *     responses:
 *       200:
 *         description: 登入成功
 *     security:
 *       - server_auth:
 *         - "oauth2_token"
 */
// #endregion
router.get('/test', async (ctx, next) => {
  ctx.success(true);
});

// #region
/**
 * @swagger
 * /common/getToken:
 *   get:
 *     description: 获取token
 *     tags: [公共模块]
 *     produces:
 *       - application/x-www-form-urlencoded
 *       - application/json
 *     parameters:
 *       -userName:
 *        description:
 *        in: query
 *        type: string
 *       -password:
 *        description:
 *        in: query
 *        type: string
 *     responses:
 *       200:
 *         description: 登入成功
 *         schema:
 *           $ref: "#/definitions/Order"
 *       400:
 *         $ref: "#/components/description"
 *     security:
 *       - token: []
 */
// #endregion
router.get('/getToken', async (ctx, next) => {
  // getIpInfo('220.181.111.85');
  const s = '::ffff:127.0.0.1 ';
  console.log(s.substr(s.lastIndexOf(':') + 1));
  const APIServer = 'http://api.map.baidu.com/location/ip?ak=vxvdMjDXHROfGQnyYCzv4MoXrkEqDBYX&coor=bd09ll&ip=';
  const url = APIServer + '117.29.158.59';
  let resdata = {};
  http
    .get(url, res => {
      console.log(res.statusCode);
      const code = res.statusCode;
      if (code == 200) {
        res.on('data', data => {
          try {
            console.log(data.toString('utf-8'));
            resdata = JSON.parse(data);
            console.log(resdata);
          } catch (err) {
            // console.log(err);
          }
        });
      } else {
      }
    })
    .on('error', e => {});
  ctx.success(true);
});

module.exports = router;
