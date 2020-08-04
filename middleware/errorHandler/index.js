/**
 * @author: linzq
 * @date: 2020/07/21
 * @description: 统一错误异常处理
 */

module.exports = app => {
  app.use(async (ctx, next) => {
    let status = 0;
    try {
      await next();
      console.log('13:' + ctx.status);
      status = ctx.status;
    } catch (err) {
      console.log(err);
      ctx.error([500, '内部服务器错误!']);
      status = 500;
    }
    if (status >= 400) {
      switch (status) {
        case 400:
          ctx.error([400, '参数错误!']);
          break;
        case 404:
          ctx.error([404, 'not found!']);
          break;
        case 500:
          ctx.error([500, '内部服务器错误!']);
          break;
        default:
          ctx.error([500, '内部服务器错误!']);
          break;
      }
    }
  });
};
