/** !
 * response
 * Copyright(c) 2020
 * MIT Licensed
 *
 * Authors: linzq
 * describe: 返回实体类
 */

'use strict';
const logsUtil = require('../../utils/logs.js'); // 日志文件

const response = {
  code: 1,
  data: '',
  message: '操作成功'
};

/**
 * response
 * @param ctx
 * @param data 数据
 * @param code 错误码 || [错误码, 错误描述]
 * @param message 错误描述
 */
exports.response = (ctx, data, code, message) => {
  if (typeof code == 'object') {
    message = code[1];
    code = code[0];
  }
  ctx.body = {
    code,
    data,
    message
  };
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
exports.error = (ctx, code = 0, message = '操作失败') => {
  if (typeof code === 'object') {
    message = code[1];
    code = code[0];
  }
  logsUtil.logError(ctx, message, 0); // 记录异常日志
  this.response(ctx, response.data, code, message);
};
