/*
 * @Author: linzq
 * @Date: 2020-11-25 10:02:48
 * @LastEditors: linzq
 * @LastEditTime: 2021-03-26 14:17:24
 * @Description: 统一错误异常处理
 */

// 这里的工作是捕获异常生成返回的接口
const catchError = async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    // mysql报错处理
    if (error.errno) {
      // sql报错处理
      ctx.errorLog('sql查询报错', error); // 记录异常日志
      ctx.error([0, 'sql查询报错'], error.sqlMessage);
    } else if (error.original && error.original.errno) {
      // sequelize报错处理
      ctx.errorLog('seq查询报错', error.original); // 记录异常日志
      ctx.error([0, 'seq查询报错'], error.original.sqlMessage);
    } else if (error.code) {
      ctx.errorLog(error.code, error); // 记录异常日志
      ctx.error([error.code, error.msg]);
    } else {
      // 对于未知的异常，采用特别处理
      ctx.errorLog('未知的异常', error); // 记录异常日志
      ctx.error([-1, '未知的异常'], 'we made a mistake');
    }
  }
};

module.exports = catchError;
