/*
 * @Author: linzq
 * @Date: 2020-11-25 10:02:48
 * @LastEditors: linzq
 * @LastEditTime: 2021-04-19 10:51:25
 * @Description: mysql配置
 */
const mq = require('mysql2');
const proSql = require('./sql.json');

const g = global.config;
const SQL_CFG = g.NODE_ENV === 'development' ? g.dev : proSql;
// 如有报错使用下面这个
// const SQL_CFG = g.NODE_ENV === 'development' ? g.dev : g.pro;
const mysql = mq.createConnection(SQL_CFG);

mysql.connect(err => {
  if (err) throw err;
  console.log('数据库连接成功!');
});

// 连接池连接
const pool = mq.createPool(SQL_CFG);

// 接收一个sql语句 以及所需的values
// 这里接收第二参数values的原因是可以使用mysql的占位符 '?'
// 比如 query(`select * from my_database where id = ?`, [1])

module.exports.query = function (sql, values) {
  // 返回一个 Promise
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(err);
      } else {
        connection.query(sql, values, (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
          // 结束会话
          connection.release();
        });
      }
    });
  });
};

// module.exports = mysql;
