/**
 * @author linzq
 * @date 2020/6/16
 * @description 返回实体中间件
 */

const { success, error } = require('./response');

module.exports = async (ctx, next) => {
  ctx.success = success.bind(null, ctx);
  ctx.error = error.bind(null, ctx);
  await next();
};
