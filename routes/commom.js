const Table = require('../class/tableList');
const mysql = require('../mysql');
const router = require('koa-router')();

router.prefix('/commom');

const code = {
  UNKNOWN_ERROR: [0, 'Sorry, you seem to have encountered some unknown errors.']
};

// 导航栏获取
router.get('/navigation', async (ctx, next) => {
  const sql = 'select * from route';
  const result = await mysql.query(sql);
  const total = await mysql.query('SELECT count(id) FROM route;'); //total[0]['count(id)']
  const table = new Table();
  ctx.success(table.tableTotal(undefined, result));
});

module.exports = router;
