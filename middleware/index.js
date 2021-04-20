/**
 * @Author: 林中奇
 * @Date: 2020/08/10
 * @lastAuthor:
 * @lastChangeDate:
 * @Explain: 公共方法中间件
 */

const fs = require('fs');

/**
 * 验证文件系统是否存在
 * @param String path 文件路径
 */
exports.checkPath = (ctx, path) => {
  try {
    fs.accessSync(path);
    return true;
  } catch (err) {
    ctx.errorLog('文件不存在！', err);
    return false;
  }
};

module.exports = async (ctx, next) => {
  ctx.checkPath = this.checkPath.bind(null, ctx); // 文件存在性检验
  await next();
};
