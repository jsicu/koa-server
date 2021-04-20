/*
 * @Author: linzq
 * @Date: 2021-03-23 14:24:09
 * @LastEditors: linzq
 * @LastEditTime: 2021-04-20 19:22:01
 * @Description: 模型数据库同步
 */

const sequelize = require('./db/db.js');
require('./db/models/init-models.js')(sequelize); // models\init-models.js
sequelize
  .sync({
    force: false // 如果表已经存在，则删除表后再创建
  })
  .then(result => {
    console.log('所有模型均已成功同步');
    process.exit();
  })
  .catch(err => {
    console.log('所有模型均已成功失败');
    console.log(err);
  });
