/*
 * @Author: linzq
 * @Date: 2021-03-01 19:36:54
 * @LastEditors: linzq
 * @LastEditTime: 2021-03-04 22:27:59
 * @Description: 大屏接口
 */
const mysql = require('../../mysql');
const Table = require('../../class/tableList'); // 列表返回格式
const router = require('koa-router')();
const sql = require('./sql');

router.prefix('/bigScreen');

// 热力图数据
// #region
/**
 * @swagger
 * /bigScreen/list:
 *   post:
 *     summary: 数据列表
 *     description: 数据列表
 *     tags: [可视化模块]
 *     parameters:
 *       - name: pageNum
 *         description: 页码
 *         in: formData
 *         type: number
 *       - name: pageSize
 *         description: 条数
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
router.post('/list', async ctx => {
  const data = ctx.request.body;
  const list = await mysql.query(sql.list(1000));
  const table = new Table();
  ctx.success(table.tableTotal(list.length, list));
});

// #region
/**
 * @swagger
 * /bigScreen/gradeDistribution:
 *   post:
 *     summary: 等级情况分布
 *     description: 等级情况分布
 *     tags: [可视化模块]
 *     parameters:
 *       - name: year
 *         description: 年份
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
router.post('/gradeDistribution', async ctx => {
  const data = ctx.request.body;
  const list = await mysql.query(sql.grade(data.year));
  const returnData = {
    A: 0,
    AA: 0,
    AAA: 0,
    AAAA: 0,
    AAAAA: 0
  };
  for (const iterator of list) {
    const year = data.year ? data.year : 2020;
    switch (iterator[`grade_${year}`]) {
      case '1':
        returnData.A++;
        break;
      case '2':
        returnData.AA++;
        break;
      case '3':
        returnData.AAA++;
        break;
      case '4':
        returnData.AAAA++;
        break;
      case '5':
        returnData.AAAAA++;
        break;

      default:
        break;
    }
  }
  // const table = new Table();
  ctx.success(returnData);
});

// 导出
module.exports = router;
