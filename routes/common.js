/*
 * @Author: linzq
 * @Date: 2020-11-25 10:02:48
 * @LastEditors: linzq
 * @LastEditTime: 2021-03-16 22:08:46
 * @Description:
 */
const Table = require('root/core/tableList');
const mysql = require('../mysql');
const router = require('koa-router')();

router.prefix('/common');

const code = {
  UNKNOWN_ERROR: [0, 'Sorry, you seem to have encountered some unknown errors.']
};

// 导航栏获取
router.get('/navigation', async (ctx, next) => {
  const sql = 'select * from route';
  const result = await mysql.query(sql);
  const total = await mysql.query('SELECT count(id) FROM route;'); // total[0]['count(id)']
  ctx.success(Table.tableTotal(undefined, result));
});

module.exports = router;
