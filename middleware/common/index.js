/**
 * @author linzq
 * @date 2020/9/7
 * @description 通用方法
 */

const { getUUID } = require('./common');

module.exports = async (ctx, next) => {
  ctx.getUUID = getUUID.bind(null, ctx);
  await next();
};