/**
 * @author linzq
 * @date 2020/11/27
 * @description 日志中间件
 */

const { logResponse, logHandle, logError, logInfo } = require('./log');

module.exports = async (ctx, next) => {
  ctx.responseLog = logResponse.bind(null, ctx);
  ctx.consoleLog = logInfo.bind(null, ctx);
  ctx.errorLog = logError.bind(null, ctx);
  ctx.handleLog = logHandle.bind(null, ctx);
  await next();
};
