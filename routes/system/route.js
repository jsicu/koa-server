/**
 * @Author: linzq
 * @Date: 2021-08-19 17:08:02
 * @LastEditors: linzq
 * @LastEditTime: 2021-11-18 11:03:15
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

// const pattern = /^(1?[0-9]{2}?00)$/;
router.get('/list', async (ctx, next) => {
  const data = ctx.request.query;
  const schema = Joi.object({
    name: ctx.joiReplaceSpace('路由名称'),
    alias: ctx.joiReplaceSpace('路由地址'),
    status: ctx.joiReplaceSpace('路由状态'),
    parentId: ctx.joiReplaceSpace()
  });
  const { parentId, name, alias, status } = data;
  const required = { name, alias, status, parentId };
  const value = schema.validate(required);
  if (value.error) throw new global.err.ParamError(value.error.message);

  const search = {};
  for (const i in required) {
    if (required[i] && i === 'parentId') {
      search[i] = { [Op.eq]: required[i] };
    } else if (required[i]) {
      search[i] = { [Op.substring]: required[i] };
    }
  }
  const res = await models.route.findAll({
    where: search,
    attributes: ['id', 'name', 'alias', 'status', 'parentId', 'createTime', 'description']
  });

  const list = JSON.parse(JSON.stringify(res));
  let routeList = [];
  list.forEach(element => {
    if (element.parentId === 0) {
      element.children = [];
      // element.status = !element.status;
      routeList.push(element);
    }
  });

  routeList = routeList.map(item => {
    list.forEach(element => {
      if (element.parentId === item.id) {
        // element.status = item.status ? element.status : item.status;
        element.disabled = !item.status;
        item?.children.push(element);
      }
    });
    return item;
  });
  ctx.success(Table.tableTotal(undefined, routeList));
});

// 路由保存
router.post('/', async ctx => {
  const data = ctx.request.body;
  const schema = Joi.object({
    name: Joi.required().invalid('').error(new Error('菜单名称不得为空')),
    alias: Joi.required().invalid('').error(new Error('菜单地址不得为空')),
    status: Joi.required().invalid('').error(new Error('菜单状态不得为空')),
    id: Joi.required().invalid('').error(new Error('菜单id不得为空')),
    description: Joi.string().empty('').max(50).error(new Error('菜单描述长度不得超过50')),
    parentId: Joi.number().error(new Error('父菜单不得为空'))
  });
  const { name, alias, status, id, description, parentId = 0 } = data;
  const required = { name, alias, status, id, description, parentId };
  const value = schema.validate(required);
  if (value.error) throw new global.err.ParamError(value.error.message);
  await models.route.create(required);
  ctx.success(true);

  // 新路由id写进超级账号权限power
  // const decryptTk = ctx.decryptRSAToken(ctx.request.header.token);
  const userPower = await models.user.findAll({
    attributes: ['userName', 'power'],
    where: { id: '00000000-0000-0000-0000-000000000000' }
  });
  await models.user.update(
    { power: `${userPower[0].power},${id}` },
    {
      attributes: ['userName', 'power'],
      where: { id: '00000000-0000-0000-0000-000000000000' }
    }
  );
});

// 路由更新
router.put('/', async ctx => {
  const data = ctx.request.body;
  const schema = Joi.object({
    name: Joi.required().invalid('').error(new Error('菜单名称不得为空')),
    alias: Joi.required().invalid('').error(new Error('菜单地址不得为空')),
    status: Joi.required().invalid('').error(new Error('菜单状态不得为空')),
    id: Joi.required().invalid('').error(new Error('菜单id不得为空')),
    description: Joi.string().empty('').max(50).error(new Error('菜单描述长度不得超过50')),
    parentId: Joi.number().error(new Error('父菜单不得为空'))
  });
  const { name, alias, status, id, description = '', parentId = 0 } = data;
  const required = { name, alias, status, id, description, parentId };
  const value = schema.validate(required);
  if (value.error) throw new global.err.ParamError(value.error.message);
  const res = await models.route.update(required, { where: { id: required.id } });
  if (res[0] === 1) {
    ctx.success(true);
  } else {
    ctx.error([0, '修改失败']);
  }
  ctx.success(true);
});

// id存在性验证
router.post('/checkId', async ctx => {
  const data = ctx.request.body;
  const schema = Joi.object({
    id: Joi.string().length(5).error(new Error('菜单id格式不正确')),
    alias: Joi.string().error(new Error('菜单地址格式不正确'))
  });
  const { id, alias } = data;
  const required = { id, alias };
  const value = schema.validate(required);
  if (value.error) throw new global.err.ParamError(value.error.message);

  const search = {};
  for (const i in required) {
    if (required[i]) {
      search[i] = { [Op.eq]: required[i] };
    }
  }

  const { count, rows } = await models.route.findAndCountAll({
    where: { [Op.or]: [search] },
    attributes: ['id', 'name', 'alias', 'status', 'parentId', 'createTime', 'description']
  });

  if (count > 0) {
    ctx.success(false);
  } else {
    ctx.success(true);
  }
});

module.exports = router;
