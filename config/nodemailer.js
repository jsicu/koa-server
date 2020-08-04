/**
 * @author: linzq
 * @date: 2020/07/20
 * @description: 邮件服务配置
 */
const nodemailer = require('nodemailer');

const Email = {
  config: {
    host: 'smtp.qq.com',
    port: 587,
    auth: {
      user: '', // 发件人qq邮箱
      pass: '' // 密码
      // pass: '' // IMAP/SMTP服务密码
    }
  },
  get transporter() {
    // get方法,直接得到config对象  transporter：在controlers的user.js里要用这个方法
    return nodemailer.createTransport(this.config);
  },
  get verify() {
    // verify自定义的方法：生成验证码
    return Math.random().toString().substring(2, 6); // substring(2,6)：验证码要4位，从2到6位提取
  },
  get time() {
    return Date.now();
  }
};
module.exports = { Email };
