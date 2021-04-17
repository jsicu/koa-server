/*
 * @Author: linzq
 * @Date: 2020-11-25 10:02:48
 * @LastEditors: linzq
 * @LastEditTime: 2021-04-17 18:20:42
 * @Description: 配置文件
 */
/** session配置 */
const sessionConfig = {
  key: 'koa:sess', // cookie key (默认koa：sess)
  maxAge: 10000, // cookie的过期时间,毫秒，默认为1天(86400000)
  overwrite: true, // 是否覆盖    (默认default true)
  httpOnly: false, // cookie是否只有服务器端可以访问,默认为true
  signed: true, // 签名默认true
  rolling: false, // 在每次请求时强行设置cookie，这将重置cookie过期时间（默认：false）
  renew: false // (boolean) 会话即将到期时,续订会话
};

module.exports = {
  sessionConfig,
  NODE_ENV: 'development' // production development
};
