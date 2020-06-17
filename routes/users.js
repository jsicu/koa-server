const mysql = require('../mysql');
const router = require('koa-router')();
const paramCheck = require('../tool/paramCheck');

router.prefix('/users');

const code = {
  UNKNOWN_ERROR: [1, 'Sorry, you seem to have encountered some unknown errors.']
};

router.get('/', (ctx, next) => {
  ctx.body = 'this is a users response!';
});

router.get('/bar', (ctx, next) => {
  ctx.body = 'this is a users/bar response';
});

// router.post('/login', async (ctx, next) => {
//   const requestParam = ['name', 'password'];
//   const user = ctx.request.body;
//   if (paramCheck.check(user, requestParam) !== true) {
//     ctx.error([1, paramCheck.check(user, requestParam)]);
//   } else {
//     ctx.success({
//       type: 1
//     });
//   }
//   // mysql.query(
//   //   'SELECT * FROM `koa2_server`.`user` LIMIT 0,1000',
//   //   (error, results, fields) => {
//   //     if (error) throw error;
//   //     // console.log('The solution is: ', results);
//   //   }
//   // );
//   console.log(ctx.request.body);
// });

router.post('/test', async (ctx, next) => {
  const user = ctx.request.body;
  ctx.success({
    list: '成功'
  });
  console.log(ctx.request.body);
});

module.exports = router;
