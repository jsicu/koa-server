const mysql = require('../mysql');
const router = require('koa-router')();
const paramCheck = require('../tool/paramCheck');

router.prefix('/users');

const code = {
  UNKNOWN_ERROR: [0, 'Sorry, you seem to have encountered some unknown errors.']
};

router.get('/', (ctx, next) => {
  ctx.body = 'this is a users response!';
});

router.get('/bar', (ctx, next) => {
  ctx.body = 'this is a users/bar response';
});

module.exports = router;
