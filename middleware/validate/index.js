/*
 * @Author: linzq
 * @Date: 2021-03-25 16:51:35
 * @LastEditors: linzq
 * @LastEditTime: 2021-03-30 10:16:51
 * @Description:
 */
const { joiReplace, joiRequired, joiReplaceSpace } = require('./validate');

module.exports = async (ctx, next) => {
  ctx.joiReplace = joiReplace.bind(null, ctx);
  ctx.joiRequired = joiRequired.bind(null, ctx);
  ctx.joiReplaceSpace = joiReplaceSpace.bind(null, ctx);
  await next();
};
