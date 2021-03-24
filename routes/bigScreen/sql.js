/*
 * @Author: linzq
 * @Date: 2021-03-01 19:40:24
 * @LastEditors: linzq
 * @LastEditTime: 2021-03-24 13:56:52
 * @Description:
 */
/**
 * 文件说明
 * @class sql语句
 * @constructor
 */

// 获取列表
const list = (pageNum = 1, pageSize = 10) => {
  return `select * from scenic_spot limit ${(pageNum - 1) * pageSize}, ${pageSize};
  select COUNT(id) as total from scenic_spot;`;
};
// 获取列表
const allList = (num = 1000) => {
  return `SELECT dest_id, dest_name, lat, lng FROM scenic_spot limit ${num};`;
};
// 等级情况分布
const grade = (year = 2020) => {
  return `SELECT grade_${year} FROM scenic_spot where grade_${year} != ''`;
};
// 等级情况分布 景区类型
const numList = name => {
  return `SELECT ${name} as type,COUNT(*) as total FROM scenic_spot GROUP BY ${name};`;
};
// 等级情况分布 景区类型
const detail = (lng, lat) => {
  return `SELECT * from scenic_spot where lng = '${lng}' && lat = '${lat}';`;
};

// 游客总数
const touristTotal = `select sum(year_tourists_2015) as 'sum2015' from scenic_spot;
  select sum(year_tourists_2016) as 'sum2016' from scenic_spot;
  select sum(year_tourists_2017) as 'sum2017' from scenic_spot;
  select sum(year_tourists_2018) as 'sum2018' from scenic_spot;
  select sum(year_tourists_2019) as 'sum2019' from scenic_spot;
  select sum(year_tourists_2020) as 'sum2020' from scenic_spot;`;
// 游客总数
const scenicTotal = `SELECT COUNT(grade_2015) as 'grade2015' FROM scenic_spot where grade_2015 != '';
SELECT COUNT(grade_2016) as 'grade2016' FROM scenic_spot where grade_2016 != '';
SELECT COUNT(grade_2017) as 'grade2017' FROM scenic_spot where grade_2017 != '';
SELECT COUNT(grade_2018) as 'grade2018' FROM scenic_spot where grade_2018 != '';
SELECT COUNT(grade_2019) as 'grade2019' FROM scenic_spot where grade_2019 != '';
SELECT COUNT(grade_2020) as 'grade2020' FROM scenic_spot where grade_2020 != '';`;

const topTen =
  "SELECT SUBSTRING_INDEX(navigation_bar,'>',1) as name, SUM(tourists_num) as value from scenic_spot GROUP BY name  ORDER BY value desc LIMIT 0, 10;";
// 类型数量
const typeNumList = 'SELECT type as typeId, SUM(tourists_num) as total from scenic_spot GROUP BY typeId;';
// 字典
const dict = 'SELECT dict_id as typeId, label as typeName from dictionary;';

const realData = `SELECT SUM(tourists_num) as tourists from scenic_spot;
SELECT SUM(today_tourists_num) as todayTourists from scenic_spot;
SELECT ROUND(avg(play_time), 0) as playTime from scenic_spot;
SELECT ROUND(avg(tourists_num), 0) as touristsAvg from scenic_spot;
SELECT max(tourists_num) as maxTourists from scenic_spot;
SELECT min(today_tourists_num) as minTodayTourists from scenic_spot;
SELECT max(today_tourists_num) as maxTodayTourists from scenic_spot;
SELECT max(play_time) as maxPlayTime from scenic_spot;`;

module.exports = {
  list,
  allList,
  grade,
  numList,
  touristTotal,
  scenicTotal,
  topTen,
  typeNumList,
  dict,
  realData,
  detail
};
