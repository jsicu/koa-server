/*
 * @Author: linzq
 * @Date: 2021-03-23 14:22:54
 * @LastEditors: linzq
 * @LastEditTime: 2021-03-31 17:51:57
 * @Description: 数据模型入口文件
 */

const user = require('./model/user'); // 用户表
const route = require('./model/route'); // 路由表
const onlineToken = require('./model/onlineToken'); // token表
const dictionary = require('./model/dictionary'); // 字典表
const scenicSpot = require('./model/scenicSpot'); // 景区表
const captcha = require('./model/captcha'); // 景区表
const log = require('./model/log'); // 日志表

// 可以在此文件中建立外键关联关系
onlineToken.belongsTo(user, {
  foreignKey: 'userId',
  targetKey: 'id'
});
captcha.belongsTo(user, {
  foreignKey: 'userId',
  targetKey: 'id'
});

// User->Blog
// User.hasMany(Blog)

module.exports = {
  user,
  route,
  onlineToken,
  dictionary,
  scenicSpot,
  captcha,
  log
};
