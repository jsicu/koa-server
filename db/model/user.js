/*
 * @Author: linzq
 * @Date: 2021-03-23 14:19:45
 * @LastEditors: linzq
 * @LastEditTime: 2021-03-24 11:38:45
 * @Description: 用户表数据模型
 */
const Sequelize = require('sequelize');
const seq = require('../db');

// users
const user = seq.define(
  'user',
  {
    id: {
      type: Sequelize.STRING(64),
      primaryKey: true,
      allowNull: false, // 是否允许为空
      unique: true, // 是否是唯一索引
      comment: '主键'
    },
    userName: {
      type: Sequelize.STRING,
      allowNull: false, // 是否允许为空
      unique: true, // 是否是唯一索引
      comment: '用户名，唯一'
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
      comment: '密码'
    },
    isCancel: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: 0,
      comment: '状态 0：有效，1：失效'
    }
  },
  {
    // 写表注释
    comment: '用户信息表'
  }
);

module.exports = user;
