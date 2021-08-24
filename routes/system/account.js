/*
 * @Author: linzq
 * @Date: 2020-11-25 10:02:48
 * @LastEditors: linzq
 * @LastEditTime: 2021-04-19 18:42:42
 * @Description: 账号管理模块
 */
const Table = require('root/core/tableList');
const router = require('koa-router')();
const path = require('path');
const Joi = require('joi'); // 参数校验
const fs = require('fs');
const models = require('@db/index');
const { Op } = require('sequelize');

const seq = require('@db/db');

router.prefix('/account');

const code = {
  UNKNOWN_ERROR: [0, 'Sorry, you seem to have encountered some unknown errors.']
};
const pwdPath = path.resolve(__dirname);

// #region
/**
 * @swagger
 * /account/list:
 *   get:
 *     summary: 账号列表
 *     description: 账号列表
 *     tags: [系统管理模块]
 *     parameters:
 *       - name: pageNum
 *         description: 页码
 *         in: formData
 *         type: number
 *       - name: pageSize
 *         description: 条数
 *         in: formData
 *         type: number
 *       - name: userName
 *         description: 用户名
 *         in: formData
 *         type: string
 *       - name: isCancel
 *         description: 状态
 *         in: formData
 *         type: number
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
 *     security:
 *       - token: {}
 */
// #endregion
router.get('/list', async (ctx, next) => {
  const data = ctx.request.query;
  const schema = Joi.object({
    pageNum: ctx.joiRequired('pageNum'),
    pageSize: ctx.joiRequired('pageSize'),
    userName: ctx.joiReplaceSpace(),
    isCancel: ctx.joiReplace()
  });
  const { pageNum, pageSize, userName, isCancel } = data;
  let required = { pageNum, pageSize, userName, isCancel };
  const value = await schema.validate(required);
  if (value.error) throw new global.err.ParamError(value.error.message);
  required = value.value;

  delete required.pageNum;
  delete required.pageSize;
  const search = {};
  for (const i in required) {
    if (required[i]) {
      search[i] = { [Op.substring]: required[i] };
    }
  }
  const { count, rows } = await models.user.findAndCountAll({
    attributes: ['id', 'userName', 'mailbox', 'isCancel', 'createTime'],
    offset: (pageNum - 1) * pageSize,
    limit: pageSize - 0,
    where: search
  });
  ctx.success(Table.tableTotal(count, rows));
});

module.exports = router;
