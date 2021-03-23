/*
 * @Author: linzq
 * @Date: 2021-03-23 22:04:32
 * @LastEditors: linzq
 * @LastEditTime: 2021-03-23 22:12:30
 * @Description: dictionary 字典表模型
 */
const Sequelize = require('sequelize');
const seq = require('../db');

// users
const dictionary = seq.define('dictionary', {
  dictId: {
    type: Sequelize.INTEGER,
    allowNull: false, // 是否允许为空
    comment: '字典id'
  },
  label: {
    type: Sequelize.STRING,
    allowNull: false,
    comment: '字典名称'
  },
  value: {
    type: Sequelize.INTEGER,
    allowNull: false,
    comment: '值'
  }
});

module.exports = dictionary;
