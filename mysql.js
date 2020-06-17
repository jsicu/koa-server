const mq = require('mysql2');
const mysql = mq.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'world',
  charset: 'utf8mb4'
});

mysql.connect(err => {
  if (err) throw err;
  console.log('数据库连接成功!');
});

module.exports = mysql;
