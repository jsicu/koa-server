/**
 * 类说明
 * @class 列表返回公共类
 * @constructor
 */
class Table {
  // constructor(total, list) {
  //   // pageSize = undefined, pageNum = undefined
  //   this.total = total;
  //   this.list = list;
  //   // this.pageSize = pageSize;
  //   // this.pageNum = pageNum;
  // }

  /** 方法说明
   * @method 列表返回
   * @for Table
   * @param number total 总数
   * @param object list 列表
   * @param number pageSize 页数
   * @param number pageNum 页码
   * @return Object
   */
  tableList(total, list, pageSize, pageNum) {
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
  tableTotal(total, list) {
    const res = {
      total,
      list
    };
    return res;
  }
}

module.exports = Table;
