/*
 * @Author: linzq
 * @Date: 2021-03-23 14:19:45
 * @LastEditors: linzq
 * @LastEditTime: 2021-03-24 13:47:30
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
},
{
  timestamps: false, // 是否自动创建时间字段， 默认会自动创建createdAt、updatedAt
  paranoid: false, // 是否自动创建deletedAt字段
  // 写表注释
  comment: 'token表'
});

module.exports = onlineToken;
