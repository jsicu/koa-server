/*
 * @Author: linzq
 * @Date: 2021-03-16 17:30:50
 * @LastEditors: linzq
 * @LastEditTime: 2021-03-16 20:29:16
 * @Description: 异常处理中间件
 */
class HttpException extends Error {
  constructor(msg = '服务器异常', code = 400) {
    super();
    this.code = code;
    this.msg = msg;
  }
}

class ParamError extends HttpException {
  constructor(msg) {
    super();
    this.code = 400;
    this.msg = msg || '参数错误';
  }
}

class NotFound extends HttpException {
  constructor(msg) {
    super();
    this.msg = msg || '资源未找到';
    this.code = 404;
  }
}

class AuthFailed extends HttpException {
  constructor(msg) {
    super();
    this.msg = msg || '授权失败';
    this.code = 404;
  }
}

class Forbidden extends HttpException {
  constructor(msg) {
    super();
    this.msg = msg || '禁止访问';
    this.code = 404;
  }
}

module.exports = {
  HttpException,
  ParamError,
  NotFound,
  AuthFailed,
  Forbidden
};
