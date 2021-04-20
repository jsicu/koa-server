/*
 * @Author: linzq
 * @Date: 2021-03-16 21:54:34
 * @LastEditors: linzq
 * @LastEditTime: 2021-03-16 22:08:30
 * @Description: 列表返回公共类
 */
class Table {
  /** 方法说明
   * @method 列表返回
   * @for Table
   * @param number total 总数
   * @param object list 列表
   * @param number pageSize 页数
   * @param number pageNum 页码
   * @return Object
   */
  static tableList(total, list, pageSize, pageNum) {
    const res = {
      total,
      list,
      pageSize,
      pageNum
    };
    return res;
  }

  /** 方法说明
   * @method 列表返回(不带页数页码)
   * @for Table
   * @param number total 总数
   * @param object list 列表
   * @return Object
   */
  static tableTotal(total, list) {
    const res = {
      total,
      list
    };
    return res;
  }
}

module.exports = Table;
