/*
 * @Author: linzq
 * @Date: 2021-03-24 11:05:45
 * @LastEditors: linzq
 * @LastEditTime: 2021-03-24 16:36:01
 * @Description: 图像验证数据缓存表
 */
const Sequelize = require('sequelize');
const seq = require('../db');

// users
const captcha = seq.define(
  'captcha',
  {
    userId: {
      type: Sequelize.STRING(64),
      allowNull: false,
      comment: '用户表主键，未限制一人一地登录'
    },
    type: {
      type: Sequelize.INTEGER,
      allowNull: false, // 是否允许为空
      comment: '验证类型，0：滑块拼图；1：点击验证'
    },
    checkJson: {
      type: Sequelize.STRING,
      allowNull: false, // 是否允许为空
      comment: '验证数据'
    }
  },
  {
    // 写表注释
    comment: '验证信息表'
  }
);

module.exports = captcha;
