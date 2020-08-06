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
 *         description: Ok
 *         schema:
 *           type: 'object'
 *           properties:
 *             code:
 *               type: 'number'
 *             data:
 *               type: 'object'
 *               description: 返回数据
 *             message:
 *               type: 'string'
 *               description: 消息提示
 *       '400':
 *         description: 请求参数错误
 *       '404':
 *         description: not found
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
