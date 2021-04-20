/*
 * @Author: linzq
 * @Date: 2020-11-25 10:02:48
 * @LastEditors: linzq
 * @LastEditTime: 2021-04-20 17:28:38
 * @Description: 统一接口返回格式
 */

'use strict';

/**
 * response
 * @param ctx
 * @param data 数据
 * @param code 错误码 || [错误码, 错误描述]
 * @param message 错误描述
 */
exports.response = async (ctx, data, code, message) => {
  if (typeof code == 'object') {
    message = code[1];
    code = code[0];
  }
  // refreshToken
  if (ctx.request.header.refresh_token) {
    ctx.res.setHeader('Authorization', ctx.getToken(ctx.request.header.token, global.config.refreshTime));
  } else if (ctx.response.header.refresh) {
    return (ctx.body = {
      code,
      data,
      message,
      refresh: true
    });
  }
  return (ctx.body = {
    code,
    data,
    message
  });
};

/**
 * response 成功
 * @param ctx
 * @param data 数据
 * @param code 错误码 || [错误码, 错误描述]
 * @param message 错误描述
 */
exports.success = (ctx, data, code = 1, message = '操作成功') => {
  if (typeof code === 'string') {
    message = code;
  }
  this.response(ctx, data, code, message);
};

/**
 * response 异常
 * @param ctx
 * @param code 错误码 || [错误码, 错误描述]
 * @param message 错误描述
 */
exports.error = (ctx, code = 0, data = '', message = '操作失败') => {
  if (typeof code === 'object') {
    message = code[1];
    code = code[0];
  }
  this.response(ctx, data, code, message);
};
