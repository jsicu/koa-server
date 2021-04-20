/*
 * @Author: linzq
 * @Date: 2020-11-25 10:02:48
 * @LastEditors: linzq
 * @LastEditTime: 2021-04-19 18:42:42
 * @Description:
 */
const Table = require('root/core/tableList');
const router = require('koa-router')();
const path = require('path');
const fs = require('fs');
const models = require('@db/index');

const seq = require('@db/db');

router.prefix('/common');

const code = {
  UNKNOWN_ERROR: [0, 'Sorry, you seem to have encountered some unknown errors.']
};
const pwdPath = path.resolve(__dirname);

router.get('/', async (ctx, next) => {
  ctx.success(true);
});

// 导航栏获取
router.get('/navigation', async (ctx, next) => {
  const res = await models.route.findAll({
    attributes: ['id', 'name', 'alias'],
    where: { status: 1 }
  });
  ctx.success(Table.tableTotal(undefined, res));
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
