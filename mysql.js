const mq = require('mysql2');
const mysql = mq.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'koa2_server',
  charset: 'utf8mb4'
});

// mysql.connect(err => {
//   if (err) throw err;
//   console.log('数据库连接成功!');
// });
// mysql.query(
//   'SELECT * FROM `koa2_server`.`user` LIMIT 0,1',
//   (error, results, fields) => {
//     if (error) throw error;
//     console.log('The solution is: ', results);
//   }
// );

const pool = mq.createPool({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'koa2_server'
});

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
