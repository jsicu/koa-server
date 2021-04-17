/*
 * @Author: linzq
 * @Date: 2021-03-01 19:36:54
 * @LastEditors: linzq
 * @LastEditTime: 2021-04-17 20:57:52
 * @Description: 大屏接口
 */
const mysql = require('root/mysql');
const Table = require('root/core/tableList'); // 列表返回格式
const router = require('koa-router')();
const sql = require('./sql');
const Joi = require('joi'); // 参数校验
const models = require('@db/index');
const { Op } = require('sequelize');
router.prefix('/bigScreen');

// #region
/**
 * @swagger
 * /bigScreen/dest:
 *   post:
 *     summary: 景区详情
 *     description: 景区详情
 *     tags: [可视化模块]
 *     parameters:
 *       - name: deatId
 *         description: id
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
router.get('/dest', async ctx => {
  const data = ctx.request.body;
  const schema = Joi.object({
    destId: Joi.required().invalid('').error(new Error('景区id参数不得为空'))
  });
  const { destId } = data;
  const required = { destId };
  const value = schema.validate(required);
  if (value.error) throw new global.err.ParamError(value.error.message);
  const res = await models.scenicSpot.findAll({
    where: required
  });
  ctx.success(res);
});

router.post('/dest', async ctx => {
  const data = ctx.request.body;
  const schema = Joi.object({
    destName: Joi.required().invalid('').error(new Error('景区名称不得为空'))
  });
  const { destName } = data;
  const required = { destName };
  const value = schema.validate(required);
  if (value.error) throw new global.err.ParamError(value.error.message);
  const res = await models.scenicSpot.create(data);
  ctx.success(res);
});

router.put('/dest', async ctx => {
  const data = ctx.request.body;
  const schema = Joi.object({
    destId: Joi.required().invalid('').error(new Error('景区id不得为空')),
    destName: Joi.required().invalid('').error(new Error('景区名称不得为空'))
  });
  const { destId, destName } = data;
  const required = { destId, destName };
  const value = schema.validate(required);
  if (value.error) throw new global.err.ParamError(value.error.message);
  const res = await models.scenicSpot.update(data, { where: { destId: data.destId } });
  if (res[0] === 1) {
    ctx.success(true);
  } else {
    ctx.error([0, '修改失败']);
  }
});

router.delete('/dest', async ctx => {
  const data = ctx.request.body;
  const schema = Joi.object({
    destId: Joi.required().invalid('').error(new Error('景区id不得为空'))
  });
  const { destId } = data;
  const required = { destId };
  const value = schema.validate(required);
  if (value.error) throw new global.err.ParamError(value.error.message);
  const res = await models.scenicSpot.destroy({ where: data });
  if (res === 1) {
    ctx.success(true);
  } else {
    ctx.error([0, '修改失败']);
  }
});

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
router.get('/list', async ctx => {
  const data = ctx.request.query;
  const schema = Joi.object({
    pageNum: ctx.joiRequired('pageNum'),
    pageSize: ctx.joiRequired('pageSize'),
    destName: ctx.joiReplaceSpace(),
    type: ctx.joiReplace()
  });
  const { pageNum, pageSize, destName, type } = data;
  let required = { pageNum, pageSize, destName, type };
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
  const { count, rows } = await models.scenicSpot.findAndCountAll({
    offset: (pageNum - 1) * pageSize,
    limit: pageSize - 0,
    where: search
  });
  ctx.success(Table.tableTotal(count, rows));
});

// 热力图数据
// #region
/**
 * @swagger
 * /bigScreen/allList:
 *   post:
 *     summary: 数据列表
 *     description: 数据列表
 *     tags: [可视化模块]
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
router.post('/allList', async ctx => {
  const data = ctx.request.body;
  const list = await mysql.query(sql.allList(1000));
  ctx.success(Table.tableTotal(list.length, list));
});

// #region
/**
 * @swagger
 * /bigScreen/gradeDistribution:
 *   post:
 *     summary: 等级情况 类型分布
 *     description: 等级情况 类型分布
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
// #endregion
router.post('/gradeDistribution', async ctx => {
  const data = ctx.request.body;
  const returnData = {
    grade: [], // 景区等级
    type: [] // 景点类型
  };
  const year = data.year ? data.year : 2020;

  const yearList = await mysql.query(sql.numList(`grade_${year}`)); // 等级
  const type = await mysql.query(sql.numList('type')); // 种类
  for (const ele of type) {
    returnData.type[ele.type] = ele.total;
  }
  for (const ele of yearList) {
    returnData.grade[ele.type - 1] = ele.total;
  }
  ctx.success(returnData);
});

// #region
/**
 * @swagger
 * /bigScreen/yearTrend:
 *   post:
 *     summary: 年趋势
 *     description: 年趋势
 *     tags: [可视化模块]
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
router.post('/yearTrend', async ctx => {
  const data = ctx.request.body;
  const returnData = {
    touristTotal: [],
    scenicTotal: []
  };
  const touristTotal = await mysql.query(sql.touristTotal);
  const scenicTotal = await mysql.query(sql.scenicTotal);

  for (const key in touristTotal) {
    const ele = touristTotal[key][0];
    returnData.touristTotal.push(Number(Object.values(ele)[0] / 10000).toFixed(2));
  }
  for (const key in scenicTotal) {
    const ele = scenicTotal[key][0];
    returnData.scenicTotal.push(Object.values(ele)[0]);
  }
  ctx.success(returnData);
});

// #region
/**
 * @swagger
 * /bigScreen/realtimeData:
 *   post:
 *     summary: 实时数据
 *     description: 实时数据
 *     tags: [可视化模块]
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
router.post('/realtimeData', async ctx => {
  const data = ctx.request.body;
  let returnData = {};
  const realData = await mysql.query(sql.realData);
  for (const iterator of realData) {
    returnData = { ...returnData, ...iterator[0] };
  }
  ctx.success(returnData);
});
// #region
/**
 * @swagger
 * /bigScreen/topTen:
 *   post:
 *     summary: 前十
 *     description: 前十
 *     tags: [可视化模块]
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
router.post('/topTen', async ctx => {
  const data = ctx.request.body;
  const returnData = {};
  const topTen = await mysql.query(sql.topTen);
  const typeNumList = await mysql.query(sql.typeNumList);
  const dict = await mysql.query(sql.dict);
  // console.log(topTen);

  for (const key in typeNumList) {
    for (const dictEle of dict) {
      if (typeNumList[key].typeId == dictEle.typeId) {
        typeNumList[key].typeName = dictEle.typeName;
      }
    }
  }
  returnData.typeNum = typeNumList;
  for (const key in topTen) {
    topTen[key].value = Number(topTen[key].value);
  }
  returnData.topTen = topTen;
  ctx.success(returnData);
});

// #region
/**
 * @swagger
 * /bigScreen/allData:
 *   post:
 *     summary: 所有数据
 *     description: 所有数据
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
// #endregion
router.post('/allData', async ctx => {
  const data = ctx.request.body;
  const list = await mysql.query(sql.grade(data.year));
  let returnData = {
    grade: [], // 景区等级
    type: [] // 景点类型
    // typeNum: [] // 类型-游客数
  };
  const year = data.year ? data.year : 2020;

  const yearList = await mysql.query(sql.numList(`grade_${year}`)); // 等级
  const type = await mysql.query(sql.numList('type')); // 种类
  const touristTotal = await mysql.query(sql.touristTotal);
  const topTen = await mysql.query(sql.topTen);
  const typeNumList = await mysql.query(sql.typeNumList);
  const dict = await mysql.query(sql.dict);
  // console.log(topTen);

  for (const key in typeNumList) {
    for (const dictEle of dict) {
      if (typeNumList[key].typeId == dictEle.typeId) {
        typeNumList[key].typeName = dictEle.typeName;
      }
    }
  }
  returnData.typeNum = typeNumList;
  for (const ele of type) {
    returnData.type[ele.type] = ele.total;
  }
  for (const ele of yearList) {
    returnData.grade[ele.type - 1] = ele.total;
  }
  for (const key in touristTotal) {
    const ele = touristTotal[key][0];
    returnData = { ...returnData, ...ele };
  }
  returnData.topTen = topTen;
  ctx.success(returnData);
});

// #region
/**
 * @swagger
 * /bigScreen/detail:
 *   post:
 *     summary: 景点详情
 *     description: 景点详情
 *     tags: [可视化模块]
 *     parameters:
 *       - name: lng
 *         description: 精度
 *         in: formData
 *         type: number
 *       - name: lat
 *         description: 纬度
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
router.post('/detail', async ctx => {
  const data = ctx.request.body;
  const schema = Joi.object({
    lng: Joi.required().error(new Error('lng参数不得为空！')),
    lat: Joi.required().error(new Error('lat参数不得为空！'))
  });
  const value = schema.validate(data);
  if (value.error) throw new global.err.ParamError(value.error.message);
  // if (value.error) return ctx.error([400, value.error.message]);
  const list = await mysql.query(sql.detail(data.lng, data.lat));
  ctx.success(list);
});

// 导出
module.exports = router;
