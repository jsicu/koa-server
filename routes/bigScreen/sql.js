/**
 * 文件说明
 * @class sql语句
 * @constructor
 */

// 设置随机数 `UPDATE scenic_spot set tourists_num = FLOOR(50+(rand()*50000))`
// 获取列表
const list = (num = 1000) => {
  return `SELECT dest_id, dest_name, lat, lng FROM scenic_spot limit ${num};`;
};
// 等级情况分布
const grade = (year = 2020) => {
  return `SELECT grade_${year} FROM scenic_spot where grade_${year} != ''`;
};
// 新增图片
const newImg = (imgUUID, imgName, size, UUID) => {
  return `INSERT INTO image VALUES ('${imgUUID}', '${imgName}', ${size}, '${UUID}')`;
};
// 人员详情
const personDetail = id => {
  return `SELECT *, p.person_id as person_id FROM person p LEFT JOIN image i ON p.person_id = i.person_id WHERE p.person_id = '${id}'`;
};

module.exports = { list, grade, newImg, personDetail };
