/*
 * @Author: linzq
 * @Date: 2021-03-23 14:21:52
 * @LastEditors: linzq
 * @LastEditTime: 2021-03-23 22:12:19
 * @Description: 路由模型
 */
const Sequelize = require('sequelize');
const seq = require('../db');

const route = seq.define('route', {
  name: {
    type: Sequelize.STRING(64),
    allowNull: false,
    comment: '路由名称'
  },
  alias: {
    type: Sequelize.STRING,
    allowNull: false,
    comment: '路由地址'
  },
  icon: {
    type: Sequelize.STRING(64),
    allowNull: true,
    comment: '图标'
  },
  status: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    comment: '路由状态。0：失效；1：有效'
  }
});
module.exports = route;
