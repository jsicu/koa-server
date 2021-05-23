/**
 * @Author: linzq
 * @Date: 2021-05-21 14:45:34
 * @LastEditors: linzq
 * @LastEditTime: 2021-05-21 16:08:04
 * @Description: 请求转发，服务代理
 */
const axios = require('axios');

module.exports = (opts = {}) => {
  return (ctx, next) => {
    // console.log(ctx.httpProxy);
    if (!ctx.httpProxy) {
      proxy(ctx, opts);
    }

    return next();
  };
};

function proxy(ctx, opts) {
  ctx.httpProxy = (params = {}) => {
    console.log(params);
    if (!params.host) {
      params = Object.assign({}, { host: opts.apiHost || '' }, params);
    }

    // console.log(formatReqParams(ctx, params));
    let reqParams = Object.assign({}, params, formatReqParams(ctx, params));
    console.log(reqParams);
    if (reqParams.method.toUpperCase() !== 'GET') {
      reqParams.data = params.data || ctx.request.body;
    }

    delete reqParams.headers.host;
    return axios(reqParams)
      .then(res => {
        let { data, headers } = res;

        setResCookies(ctx, headers);

        return data;
      })
      .catch(err => {
        // TODO
        // console.log(err)
        return err;
      });
  };
}
function setResCookies(ctx, headers) {
  let resCookies = headers['set-cookie'];

  if (!headers || !resCookies || !resCookies.length || resCookies.length <= 0 || !resCookies[0]) {
    return;
  }

  ctx.res._headers = ctx.res._headers || {};
  ctx.res._headerNames = ctx.res._headerNames || {};

  ctx.res._headers['set-cookie'] = ctx.res._headers['set-cookie'] || [];
  ctx.res._headers['set-cookie'] =
    ctx.res._headers['set-cookie'].concat && ctx.res._headers['set-cookie'].concat(resCookies);

  ctx.res._headerNames['set-cookie'] = 'set-cookie';
}

/**
 * @param  {} ctx koa当前执行上下文
 * @param  {} params 请求参数
 */
function formatReqParams(ctx, params) {
  let { url, method, headers, protocol } = ctx;
  console.log(url);
  let { host } = params;
  let hasProtocol = /(http|s):\/\//;

  url = params.url || url;
  method = params.method || method;
  protocol = hasProtocol.test(url) ? url.split(':')[0] : params.protocol || protocol;
  headers = Object.assign({}, headers, params.headers, {
    'content-type': params['content-type'] || headers['content-type'] || 'application/x-www-form-urlencoded'
  });
  console.log(url);
  url = `${protocol}://${host}${url}`;
  console.log(url);
  delete params.host;

  return { url, method, protocol, headers };
}
