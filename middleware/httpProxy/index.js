/**
 * @Author: linzq
 * @Date: 2021-05-21 14:45:34
 * @LastEditors: linzq
 * @LastEditTime: 2021-05-31 23:16:59
 * @Description: 请求转发，服务代理
 */
const axios = require('axios');
const qs = require('qs');

module.exports = (opts = {}) => {
  return (ctx, next) => {
    if (!ctx.httpProxy) {
      proxy(ctx, opts);
    }

    return next();
  };
};

function proxy(ctx, opts) {
  ctx.httpProxy = (params = {}) => {
    params = Object.assign({}, { host: opts.apiHost || '' }, params);

    let reqParams = Object.assign({}, params, formatReqParams(ctx, params));
    if (reqParams.method.toUpperCase() !== 'GET') {
      reqParams.data = params.data || ctx.request.body;
    }
    // application/x-www-form-urlencoded形式转发参数乱码修改
    if (qs.stringify(ctx.request.body)) {
      reqParams = { ...reqParams, data: qs.stringify(ctx.request.body) };
    }

    delete reqParams.headers.host;
    return axios(reqParams)
      .then(res => {
        const { data, headers } = res;

        setResCookies(ctx, headers);

        return data;
      })
      .catch(err => {
        // console.log(err)
        return err;
      });
  };
}
function setResCookies(ctx, headers) {
  const resCookies = headers['set-cookie'];

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
  const { host } = params;
  const hasProtocol = /(http|s):\/\//;

  url = params.url || url;
  method = params.method || method;
  protocol = hasProtocol.test(url) ? url.split(':')[0] : params.protocol || protocol;

  url = `${protocol}://${host}${url}`;
  delete params.host;

  return { url, method, protocol, headers };
}
