const router = require('koa-router')()

router.prefix('/users')

router.get('/', function (ctx, next) {
  ctx.body = 'this is a users response!'
})

router.get('/bar', function (ctx, next) {
  ctx.body = 'this is a users/bar response'
})

router.post('/list', async (ctx, next) => {
  ctx.body = 'this is a users/test response'
  console.log(ctx.request.body)
})

module.exports = router
