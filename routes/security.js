const mysql = require('../mysql');
const router = require('koa-router')();
const paramCheck = require('../tool/paramCheck');

router.prefix('/security');

router.post('/login', async (ctx, next) => {
  const requestParam = ['name', 'password'];
  const user = ctx.request.body;
  if (paramCheck.check(user, requestParam) !== true) {
    ctx.error([0, paramCheck.check(user, requestParam)]);
  } else {
    // eslint-disable-next-line quotes
    const sql = "select * from `user` where `name`='" + user.name + "' and `password`='" + user.password + "'";
    const result = await mysql.query(sql);
    if (result[0] && result[0].is_cancel === 0) {
      ctx.success(true);
    } else {
      ctx.error([0, '用户名或密码错误']);
    }
  }
});

module.exports = router;
