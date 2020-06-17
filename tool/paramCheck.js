/**
 * @Author: linzq
 * @Date: 2020/06/16
 * @Explain: 参数字段检查
 */

/**
 * 表单参数检查
 * @param object params 接收参数
 * @param array requestParam 必有参数
 */
exports.check = (params, requestParam) => {
  if (typeof params !== typeof requestParam) throw new Error('参数校验失败');
  const keys = Object.keys(params);
  for (let index = 0; index < requestParam.length; index++) {
    const element = requestParam[index];
    if (!keys.some(item => item === element)) {
      return `${element}字段必填`;
    } else if (index + 1 === requestParam.length) {
      return true;
    }
  }
};
