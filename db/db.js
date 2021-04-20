/*
 * @Author: linzq
 * @Date: 2021-03-23 11:30:43
 * @LastEditors: linzq
 * @LastEditTime: 2021-04-19 11:25:03
 * @Description: Sequelize
 */
// 不可使用别名
const Sequelize = require('sequelize');
const config = require('../config/config.js');
const proSql = require('../sql.json');

// 数据库信息
const db = config.NODE_ENV === 'development' ? config.dev : proSql;
// 如有报错使用下面这个
// const db = config.NODE_ENV === 'development' ? config.dev : config.pro;

// 连接数据库
const sequelize = new Sequelize(db.database, db.user, db.password, {
  host: db.host, // 数据库地址
  port: db.port, // 数据库端口
  dialect: 'mysql', // 指定连接的数据库类型
  timezone: '+08:00', // 时区，如果没有设置，会导致数据库中的时间字段与中国时区时间相差8小时
  pool: {
    max: 5, // 连接池中最大连接数量
    min: 0, // 连接池中最小连接数量
    idle: 30000 // 如果一个线程 30 秒钟内没有被使用过的话，那么就释放线程
  },
  logging: false, // 关闭打印
  // 解决中文输入问题
  define: {
    timestamps: true, // 是否自动创建时间字段， 默认会自动创建createdAt、updatedAt
    paranoid: true, // 是否自动创建deletedAt字段
    createdAt: 'createTime', // 重命名字段
    updatedAt: 'updateTime',
    deletedAt: 'deleteTime',
    underscored: true, // 开启下划线命名方式，默认是驼峰命名
    freezeTableName: true, // 禁止修改表名
    charset: 'utf8mb4',
    dialectOptions: {
      collate: 'utf8mb4_0900_ai_ci'
    }
  }
});

// 测试连接是否成功
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.log('Unable to connect to the database', err);
  });

module.exports = sequelize;
