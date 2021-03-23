/*
 * @Author: linzq
 * @Date: 2021-03-23 14:19:45
 * @LastEditors: linzq
 * @LastEditTime: 2021-03-23 20:44:16
 * @Description: 用户表数据模型
 */
const Sequelize = require('sequelize');
const seq = require('../db');

// users
const onlineToken = seq.define('online_token', {
  token: {
    type: Sequelize.STRING,
    allowNull: false, // 是否允许为空
    comment: '用户token'
  },
  userId: {
    type: Sequelize.STRING(64),
    allowNull: false,
    comment: '用户主键'
  }
});

module.exports = onlineToken;
