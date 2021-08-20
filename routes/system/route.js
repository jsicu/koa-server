/**
 * @Author: linzq
 * @Date: 2021-08-19 17:08:02
 * @LastEditors: linzq
 * @LastEditTime: 2021-08-20 10:12:47
 * @Description: 路由模块
 */

const Table = require('root/core/tableList');
const router = require('koa-router')();
const path = require('path');
const Joi = require('joi'); // 参数校验
const fs = require('fs');
const models = require('@db/index');
const { Op } = require('sequelize');

const seq = require('@db/db');

router.prefix('/route');

router.get('/', async (ctx, next) => {
  ctx.success(true);
});

const pattern = /^(1?[0-9]{2}?00)$/;
router.get('/list', async (ctx, next) => {
  const res = await models.route.findAll({
    attributes: ['id', 'name', 'alias', 'status']
  });

  const list = JSON.parse(JSON.stringify(res));
  let routeList = [];
  list.forEach(element => {
    if (pattern.test(element.id)) {
      element.children = [];
      element.status = !element.status;
      routeList.push(element);
    }
  });

  routeList = routeList.map(item => {
    list.forEach(element => {
      if (!pattern.test(element.id) && String(element.id).substring(0, 3) === String(item.id).substring(0, 3)) {
        element.status = item.status ? item.status : !element.status;
        item.children.push(element);
      }
    });
    return item;
  });
  ctx.success(Table.tableTotal(undefined, routeList));
});

module.exports = router;
