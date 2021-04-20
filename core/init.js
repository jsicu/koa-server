/*
 * @Author: linzq
 * @Date: 2021-03-16 15:49:37
 * @LastEditors: linzq
 * @LastEditTime: 2021-04-15 16:53:16
 * @Description: 自动加载路由
 */
const requireDirectory = require('require-directory');
const Router = require('koa-router');

class InitManager {
  static initCore(app) {
    // 把app.js中的koa实例传进来
    InitManager.app = app;
    InitManager.initLoadRouters();
    InitManager.loadHttpException();
  }

  static initLoadRouters() {
    // 注意这里的路径是依赖于当前文件所在位置的
    // 最好写成绝对路径
    const apiDirectory = `${process.cwd()}/routes`;
    const modules = requireDirectory(module, apiDirectory, {
      visit: whenLoadModule
    });
    function whenLoadModule(obj) {
      if (obj instanceof Router) {
        // 路由黑名单
        const blackList = [];
        const prefix = obj.opts.prefix;
        if (!blackList.includes(prefix)) {
          InitManager.app.use(obj.routes());
        }
      }
    }
  }

  static loadConfig(path = '') {
    const configPath = path || process.cwd() + '/config/config.js';
    const config = require(configPath);
    global.config = config;
  }

  static loadHttpException() {
    const errors = require('./http-exception');
    global.err = errors;
  }
}

module.exports = InitManager;
