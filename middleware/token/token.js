const jwt = require('jsonwebtoken');
const fs = require('fs');
const NodeRSA = require('node-rsa');
const path = require('path');
const crypto = require('crypto');

// const serect = 'token'; // 密钥，不能丢
const serect = new NodeRSA({ b: 512 }).exportKey('public');
const mysql = require('../../mysql');

// 获取公钥和私钥
// const publicKey = fs.readFileSync(path.join(__dirname, '/rsa_public_key.pem'));
// const privateKey = fs.readFileSync(path.join(__dirname, '/rsa_private_key.pem'));

// 加密必要参数
const ALGORITHM = 'aes-192-cbc';
const PASSWORD = '用于生成密钥的密码';
// 改为使用异步的 `crypto.scrypt()`。
const key = crypto.scryptSync(PASSWORD, '盐值', 24);
// 使用 `crypto.randomBytes()` 生成随机的 iv 而不是此处显示的静态的 iv。
const iv = Buffer.alloc(16, 16); // 初始化向量。

/* token再加密测试 */
const token = jwt.sign({ name: 'admin', id: 1 }, serect, { expiresIn: '1h' });
console.log(token);

const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
let encrypted = cipher.update(token, 'utf8', 'hex');
encrypted += cipher.final('hex');
console.log(encrypted);

const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
// 使用相同的算法、密钥和 iv 进行加密
let decrypted = decipher.update(encrypted, 'hex', 'utf8');
decrypted += decipher.final('utf8');
console.log(decrypted);

/**
 * token生成
 * @param Object userinfo
 */
exports.getToken = (ctx, userinfo) => {
  // 创建token并导出
  const token = jwt.sign(userinfo, serect, { expiresIn: '1h' });
  const sql = `INSERT INTO online_token (token) VALUES ('${token}')`; // 存入token
  mysql.query(sql);
  // token加密
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  let encrypted = cipher.update(token, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
};

/**
 * token解密
 * @param String 再加密后的tokens
 */
exports.decryptToken = (ctx, tokens) => {
  // 解密
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  // 使用相同的算法、密钥和 iv 进行加密
  let decrypted = decipher.update(tokens, 'hex', 'utf8');
  try {
    decrypted += decipher.final('utf8');
  } catch (error) {
    return false;
  }
  // decrypted += decipher.final('utf8');
  return decrypted;
};
/**
 * token验证
 * @param String tokens
 */
exports.checkToken = (ctx, tokens) => {
  // 解密
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  // 使用相同的算法、密钥和 iv 进行加密
  let decrypted = decipher.update(tokens, 'hex', 'utf8');
  try {
    decrypted += decipher.final('utf8');
  } catch (error) {
    return false;
  }
  // decrypted += decipher.final('utf8');
  const decoded = jwt.decode(decrypted, serect);
  return !(decoded && decoded.exp <= new Date() / 1000);
  // }
};

/**
 * token解码
 * @param String tokens
 */
exports.decryptRSAToken = (ctx, tokens) => {
  return jwt.decode(ctx.decryptToken(tokens), serect);
};

// class Check {
//   constructor(tokens) {
//     this.tokens = tokens; // 公有属性
//   }

//   /** 方法说明
//    * @method token验证
//    * @for Check
//    * @param string tokens 再加密后的token
//    * @return Boolean
//    */
//   token(tokens) {
//     try {
//       crypto.createDecipheriv(ALGORITHM, key, iv);
//       return true;
//     } catch (error) {
//       console.log(error);
//       return false;
//     }
//   }
// }
