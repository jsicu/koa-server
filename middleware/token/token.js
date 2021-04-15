/*
 * @Author: linzq
 * @Date: 2020-11-25 10:02:48
 * @LastEditors: linzq
 * @LastEditTime: 2021-04-15 17:50:41
 * @Description:
 */
const jwt = require('jsonwebtoken');
const fs = require('fs');
const NodeRSA = require('node-rsa');
const path = require('path');
const crypto = require('crypto');

const secret = 'token'; // 密钥，不能丢
// const secret = new NodeRSA({ b: 512 }).exportKey('public');
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

/**
 * token生成
 * @param Object userInfo
 */
exports.getToken = (ctx, userInfo) => {
  // 创建token并导出
  const token = jwt.sign(userInfo, secret, { expiresIn: '8h' });
  const sql = `INSERT INTO online_token (token, user_id) VALUES ('${token}', '${userInfo.id}')`; // 存入token
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
 * @return String 三点式token
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
  tokens = tokens.replace(/\s+/g, ''); // 空格替换
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
  const decoded = jwt.decode(decrypted, secret);
  return !(decoded && decoded.exp <= new Date() / 1000);
  // }
};

/**
 * token解码
 * @param String tokens
 *@return token token解码后对象
 */
exports.decryptRSAToken = (ctx, tokens) => {
  tokens = tokens.replace(/\s+/g, ''); // 空格替换
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
  const decoded = jwt.decode(decrypted, secret);
  return decoded;
};

/**
 * token验证
 * @param String tokens
 */
exports.verifyToken = (ctx, token) => {
  token = token.replace(/\s+/g, ''); // 空格替换, 超级账号换行导致会有空格
  token = this.decryptToken(token);

  try {
    // jwt.verify方法验证token是否有效
    jwt.verify(token, secret, {
      complete: true
    });
    return true;
  } catch (error) {
    console.log(error);
    return false;
    // token过期 生成新的token
    // const newToken = getToken(user);
    // 将新token放入Authorization中返回给前端
    // ctx.res.setHeader('Authorization', newToken);
  }
};
