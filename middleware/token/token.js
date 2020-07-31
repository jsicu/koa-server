const jwt = require('jsonwebtoken');
// const fs = require('fs');
const NodeRSA = require('node-rsa');

// const serect = 'token'; // 密钥，不能丢
const serect = new NodeRSA({ b: 512 }).exportKey('public');
const key = new NodeRSA({ b: 512 });
const mysql = require('../../mysql');

/**
 * token生成
 * @param Object userinfo
 */
exports.getToken = (ctx, userinfo) => {
  console.log(userinfo);
  // 创建token并导出
  const token = jwt.sign(userinfo, serect, { expiresIn: '1h' });
  const sql = `INSERT INTO online_token (token) VALUES ('${token}')`; // 存入token
  mysql.query(sql);
  // token加密
  return key.encrypt(token, 'base64');
};

/**
 * token验证
 * @param String tokens
 */
exports.checkToken = tokens => {
  if (tokens) {
    const decoded = jwt.decode(key.decrypt(tokens, 'utf8'), serect);
    return !(decoded.exp <= new Date() / 1000);
  }
};

/**
 * token解码
 * @param String tokens
 */
exports.decryptToken = tokens => {
  if (tokens) {
    return key.decrypt(tokens, 'utf8');
  }
};

/**
 * token解码
 * @param String tokens
 */
exports.decryptRSAToken = tokens => {
  if (tokens) {
    return jwt.decode(key.decrypt(tokens, 'utf8'), serect);
  }
};
