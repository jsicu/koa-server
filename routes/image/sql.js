/**
 * 文件说明
 * @class sql语句
 * @constructor
 */

// 获取人员列表
const personList =
  'SELECT *, p.person_id as person_id FROM person p LEFT JOIN image i ON p.person_id = i.person_id GROUP BY p.person_id';
// 新增人员
const newPerson = (UUID, name) => {
  return `INSERT INTO person VALUES ('${UUID}', '${name}')`;
};
// 新增图片
const newImg = (imgUUID, imgName, size, UUID) => {
  return `INSERT INTO image VALUES ('${imgUUID}', '${imgName}', ${size}, '${UUID}')`;
};
// 人员详情
const personDetail = id => {
  return `SELECT *, p.person_id as person_id FROM person p LEFT JOIN image i ON p.person_id = i.person_id WHERE p.person_id = '${id}'`;
};

module.exports = { personList, newPerson, newImg, personDetail };
