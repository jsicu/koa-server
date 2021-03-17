/**
 * @author: linzq
 * @date: 2020/07/21
 * @description: 统一错误异常处理
 */

// 这里的工作是捕获异常生成返回的接口
const catchError = async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    // console.log(error);
    if (error.errno) {
      // sql报错处理
      ctx.error([0, 'sql查询报错'], error.sqlMessage);
    } else if (error.code) {
      ctx.error([error.code, error.msg]);
    } else {
      // 对于未知的异常，采用特别处理
      ctx.errorLog(ctx, error, 'we made a mistake'); // 记录异常日志
      ctx.error([-1, '未知的异常']);
    }
  }
};

module.exports = catchError;
