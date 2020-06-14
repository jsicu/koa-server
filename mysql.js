var mq      = require('mysql');
var mysql = mq.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'password',
  database : 'world'
});
 
mysql.connect( err => {
  if (err) throw err
  console.log('数据库连接成功!')
})
 
module.exports = mysql;