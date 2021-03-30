/*
 * @Author: linzq
 * @Date: 2021-03-25 16:49:43
 * @LastEditors: linzq
 * @LastEditTime: 2021-03-30 10:14:18
 * @Description: 验证方法封装
 */

const Joi = require('joi'); // 参数校验

/**
 * 通配符替换
 */
exports.joiReplace = () => {
  // eslint-disable-next-line quotes
  return Joi.string().replace(/%/gi, `\\%`).replace(/_/gi, `\\_`);
};
/**
 * %替换
 */
exports.joiReplaceSpace = () => {
  // eslint-disable-next-line quotes
  return Joi.string().replace(/%/gi, `\\%`);
};

/**
 * 必备字符
 */
exports.joiRequired = (ctx, name) => {
  return Joi.required()
    .invalid('')
    .error(new Error(`${name}参数不得为空`));
};
