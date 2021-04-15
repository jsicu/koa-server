/*
 * @Author: linzq
 * @Date: 2021-03-31 17:44:24
 * @LastEditors: linzq
 * @LastEditTime: 2021-04-14 21:57:39
 * @Description: 日志表
 */
const Sequelize = require('sequelize');
const seq = require('../db');

const log = seq.define(
  'log',
  {
    type: {
      type: Sequelize.INTEGER,
      allowNull: false,
      comment: '日志类型'
    },
    ip: {
      type: Sequelize.STRING,
      allowNull: false,
      comment: '访问地址'
    },
    userId: {
      type: Sequelize.STRING,
      comment: '用户id'
    },
    method: {
      type: Sequelize.STRING(10),
      comment: '请求方法'
    },
    originalUrl: {
      type: Sequelize.STRING,
      comment: '请求接口'
    },
    token: {
      type: Sequelize.STRING(500),
      comment: 'token',
      allowNull: false
    },
    point: {
      type: Sequelize.STRING(50),
      comment: '坐标'
    },
    address: {
      type: Sequelize.STRING(50),
      comment: '所在地'
    }
  },
  {
    // 写表注释
    comment: '日志表'
  }
);
module.exports = log;
