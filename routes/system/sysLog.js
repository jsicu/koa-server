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

router.prefix('/sysLog');

const pwdPath = path.resolve(__dirname);

router.get('/list', async (ctx, next) => {
  const data = ctx.request.query;
  const schema = Joi.object({
    pageNum: ctx.joiRequired('pageNum'),
    pageSize: ctx.joiRequired('pageSize'),
    requestMethod: ctx.joiReplaceSpace(),
    route: ctx.joiReplaceSpace(),
    requestIp: ctx.joiReplaceSpace(),
    userName: ctx.joiReplaceSpace(),
    status: ctx.joiReplaceSpace(),
    result: Joi.number()
  });
  const { pageNum, pageSize, userName, requestMethod, route, requestIp, status, result = 0 } = data;
  let required = { pageNum, pageSize, userName, requestMethod, route, requestIp, status, result };
  const value = await schema.validate(required);
  if (value.error) throw new global.err.ParamError(value.error.message);
  required = value.value;

  delete required.pageNum;
  delete required.pageSize;
  const search = {};
  for (const i in required) {
    if (required[i]) {
      if (i === 'result') {
        if (required[i] === 1) search.resultText = { [Op.eq]: 'true' };
        if (required[i] === -1) search.resultText = { [Op.ne]: 'true' };
      } else {
        search[i] = { [Op.substring]: required[i] };
      }
    }
  }
  const { count, rows } = await models.sysLog.findAndCountAll({
    order: [['createTime', 'DESC']],
    offset: (pageNum - 1) * pageSize,
    limit: pageSize - 0,
    where: search
  });
  ctx.success(Table.tableTotal(count, rows));
});

/* 筛选字典接口 */
const sequelize = require('../../db/db.js');

router.get('/dic', async (ctx, next) => {
  const sql = `SELECT DISTINCT status FROM sys_log GROUP BY status;
  select distinct request_method from sys_log group by request_method;`;

  const [results, metadata] = await sequelize.query(sql);
  const dic = {
    status: [],
    method: []
  };
  for (const i in results[0]) {
    dic.status[i] = { label: results[0][i].status, value: results[0][i].status };
  }
  for (const i in results[1]) {
    dic.method[i] = { label: results[1][i].request_method, value: results[1][i].request_method };
  }
  ctx.success(dic);
});

module.exports = router;
