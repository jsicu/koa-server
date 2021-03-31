/*
 * @Author: linzq
 * @Date: 2020-11-25 10:02:48
 * @LastEditors: linzq
 * @LastEditTime: 2021-03-31 17:25:17
 * @Description:
 */
const Table = require('root/core/tableList');
const router = require('koa-router')();
const path = require('path');
const fs = require('fs');
const { dictionary, route } = require('@db/index');
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
  const res = await route.findAll({
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
    let ids = await dictionary.findAll({
      attributes: ['dictId'],
      group: 'dictId'
    });
    const res = JSON.parse(
      JSON.stringify(
        await dictionary.findAll({
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

module.exports = router;
