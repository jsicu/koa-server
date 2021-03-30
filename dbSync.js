/*
 * @Author: linzq
 * @Date: 2021-03-23 14:24:09
 * @LastEditors: linzq
 * @LastEditTime: 2021-03-30 14:24:07
 * @Description: 模型数据库同步
 */

const sequelize = require('./db/db.js');
require('./db/index');
sequelize
  .sync({
    force: true // 如果表已经存在，则删除表后再创建
  })
  .then(result => {
    console.log('所有模型均已成功同步');
    process.exit();
  })
  .catch(err => {
    console.log('所有模型均已成功失败');
    console.log(err);
  });
