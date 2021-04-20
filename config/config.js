/*
 * @Author: linzq
 * @Date: 2020-11-25 10:02:48
 * @LastEditors: linzq
 * @LastEditTime: 2021-04-20 19:06:18
 * @Description: 配置文件
 */
// sql配置
const sql = {
  pro: {
    host: 'localhost',
    port: 3306,
    user: 'admin',
    password: 'l@admin',
    database: 'koa2_server',
    multipleStatements: true
  },
  dev: {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'password',
    database: 'koa2_server',
    multipleStatements: true
  }
};
const redis = {
  host: '127.0.0.1',
  port: 6379
};

module.exports = {
  NODE_ENV: 'production', // production development
  dev: sql.dev,
  pro: sql.pro,
  redis,
  refreshTime: '2h' // 刷新token提前时间，单位：秒
};
