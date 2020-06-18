const mysql = require('../mysql');
const router = require('koa-router')();
const paramCheck = require('../tool/paramCheck');

const NodeRSA = require('node-rsa');
const key = new NodeRSA({ b: 1024 });
key.setOptions({ encryptionScheme: 'pkcs1' });

router.prefix('/security');

router.post('/login', async (ctx, next) => {
  const requestParam = ['name', 'password'];
  const user = ctx.request.body;
  if (paramCheck.check(user, requestParam) !== true) {
    ctx.error([0, paramCheck.check(user, requestParam)]);
  } else {
    const password = user.password.replace(/\s+/g, '+'); // 防止公钥有空格存在
    user.password = key.decrypt(password, 'utf8'); // 解密
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

// 加密公钥获取
router.get('/publicKey', async (ctx, next) => {
  const publicKey = key.exportKey('public'); // 生成公钥
  ctx.success(publicKey);
});

module.exports = router;
