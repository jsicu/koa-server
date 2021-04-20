/*
 * @Author: linzq
 * @Date: 2021-03-23 14:22:54
 * @LastEditors: linzq
 * @LastEditTime: 2021-04-17 23:42:53
 * @Description: 数据模型入口文件
 */
const sequelize = require('./db');

const initModels = require('./models/init-models');
const models = initModels(sequelize);

module.exports = models;
