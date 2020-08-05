// const mysql = require('../../mysql');
const router = require('koa-router')();
// const paramCheck = require('../utils/paramCheck');

router.prefix('/image');

// #region
/**
 * @swagger
 * /image/{id}:
 *   get:
 *     summary: Returns a list of users.
 *     description: 图片测试
 *     tags: [图片公共模块]
 *     parameters:
 *       - name: id
 *         description: 用户id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       '200':
 *         description: A JSON array of user names
 *         schema:
 *           $ref: './definitions.yaml#/definitions/WeatherResponse'
 *       '400':
 *         description: 无效的 id
 *       '404':
 *         description: 找不到指定的资源
 */
// #endregion

router.get('/:id', (ctx, next) => {
  console.log(ctx.params);
  const obj = ctx.params;
  console.log(ctx);
  // ctx.body = 'this is a users response!';
  ctx.success(obj);
});

module.exports = router;
