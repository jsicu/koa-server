/**
 * @Author: 林中奇
 * @Date: 2020/08/10
 * @lastAuthor:
 * @lastChangeDate:
 * @Explain: 公共方法
 */

const fs = require('fs');

/**
 * 验证文件系统是否存在
 * @param string path 文件路径
 */
exports.checkPath = (ctx, path) => {
  try {
    fs.accessSync(path);
    return true;
  } catch (err) {
    ctx.error([0, '文件不存在']);
    return false;
  }
};

module.exports = async (ctx, next) => {
  ctx.checkPath = this.checkPath.bind(null, ctx); // 文件存在性检验
  await next();
};