const log4js = require('log4js');
const logsConfig = require('../../config/logs.js');
// 加载配置文件
log4js.configure(logsConfig);
// 调用预先定义的日志名称
const resLogger = log4js.getLogger('resLogger');
const errorLogger = log4js.getLogger('errorLogger');
const handleLogger = log4js.getLogger('handleLogger');
const consoleLogger = log4js.getLogger('consoleLogger');

// 格式化日志文本 加上日志头尾和换行方便查看 ==>  普通日志、请求日志、响应日志、操作日志、错误日志
const formatText = {
  consoleLog: function (ctx, type, info) {
    let logText = '';
    // 响应日志头信息
    logText += '\n' + '***************info log start ***************' + '\n';
    // 日志输出接口
    logText += 'Interface: ' + JSON.stringify(ctx.request.url) + '\n';
    // 日志类型
    logText += 'log type: ' + JSON.stringify(type) + '\n';
    if (info.stack) {
      // 输出内容
      logText += 'err detail: ' + info.message + '\n';
      // 如果是报错，输出报错位置
      logText += 'err stack: ' + info.stack + '\n';
    } else {
      // 输出内容
      logText += 'info detail: ' + info + '\n';
    }
    // 响应日志结束信息
    logText += '*************** info log end ***************' + '\n';
    return logText;
  },
  request: function (req, resTime) {
    let logText = '';
    const method = req.method;
    // 访问方法
    logText += 'request method: ' + method + '\n';
    // 请求原始地址
    logText += 'request originalUrl:  ' + req.originalUrl + '\n';
    // 客户端ip
    logText += 'request client ip:  ' + req.ip + '\n';
    // 开始时间
    let startTime;
    // 请求参数
    if (method === 'GET') {
      logText += 'request query:  ' + JSON.stringify(req.query) + '\n';
      // startTime = req.query.requestStartTime;
    } else {
      logText += 'request body: ' + '\n' + JSON.stringify(req.body) + '\n';
      // startTime = req.body.requestStartTime;
    }
    // 服务器响应时间
    logText += 'response time: ' + resTime + '\n';
    return logText;
  },
  response: function (ctx, resTime) {
    let logText = '';
    // 响应日志开始
    logText += '\n' + '*************** response log start ***************' + '\n';
    // 添加请求日志
    logText += formatText.request(ctx.request, resTime);
    // 响应状态码
    logText += 'response status: ' + ctx.status + '\n';
    // 响应内容
    logText += 'response body: ' + '\n' + JSON.stringify(ctx.body) + '\n';
    // 响应日志结束
    logText += '*************** response log end ***************' + '\n';
    return logText;
  },
  handle: function (info) {
    let logText = '';
    // 响应日志开始
    logText += '\n' + '***************info log start ***************' + '\n';
    // 响应内容
    logText += 'handle info detail: ' + '\n' + JSON.stringify(info).replace(/\\n/g, '\n') + '\n';
    // 响应日志结束
    logText += '*************** info log end ***************' + '\n';
    return logText;
  },
  error: function (ctx, err, detail) {
    let logText = '';
    // 错误信息开始
    logText += '\n' + '*************** error log start ***************' + '\n';
    // 添加请求日志
    logText += formatText.request(ctx.request, 0);
    // 错误名称
    logText += 'err name: ' + err.name + '\n';
    // 错误信息
    logText += 'err message: ' + (err.message || err) + '\n';
    // 错误详情
    logText += 'err stack: ' + err.stack + '\n';
    logText += 'err detail: ' + detail + '\n';
    // 错误信息结束
    logText += '*************** error log end ***************' + '\n';
    return logText;
  }
};

/**
 * 输出console日志
 * @param [String] type console类型
 * @param [String] logInfo console内容
 */
exports.logInfo = (ctx, type, info) => {
  if (info) {
    consoleLogger.info(formatText.consoleLog(ctx, type, info));
  }
};
/**
 * 输出接口响应日志
 * @param [number] resTime 响应耗时
 */
exports.logResponse = (ctx, resTime) => {
  if (ctx) {
    resLogger.info(formatText.response(ctx, resTime));
  }
};
/**
 * logHandle--未使用
 * @param [String] type console类型
 * @param [String] logInfo console内容
 */
exports.logHandle = res => {
  if (res) {
    handleLogger.info(formatText.handle(res));
  }
};
/**
 * 程序运行报错日志
 * @param [String] error 报错类型
 * @param [String] detail 报错细节
 */
exports.logError = (ctx, error, detail = '') => {
  if (ctx && error) {
    errorLogger.error(formatText.error(ctx, detail, error));
  }
};
