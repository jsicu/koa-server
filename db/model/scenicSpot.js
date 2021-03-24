/*
 * @Author: linzq
 * @Date: 2021-03-23 20:59:22
 * @LastEditors: linzq
 * @LastEditTime: 2021-03-24 10:50:31
 * @Description: 景区详情表模型 scenic_spot
 */
const Sequelize = require('sequelize');
const seq = require('../db');

// users
const scenicSpot = seq.define(
  'scenic_spot',
  {
    destId: {
      type: Sequelize.INTEGER,
      allowNull: false, // 是否允许为空
      unique: true, // 是否是唯一索引
      comment: '景区id'
    },
    destName: {
      type: Sequelize.STRING,
      allowNull: false,
      comment: '景区名称'
    },
    destEnName: { type: Sequelize.STRING, comment: '景区英文名称' },
    navigationBar: { type: Sequelize.STRING },
    realCity: { type: Sequelize.STRING },
    city: { type: Sequelize.STRING },
    photos: { type: Sequelize.STRING(1024) },
    score: { type: Sequelize.STRING },
    ranking: { type: Sequelize.STRING },
    recommendPlaytime: { type: Sequelize.STRING },
    commentNum: { type: Sequelize.STRING },
    lat: { type: Sequelize.STRING },
    lng: { type: Sequelize.STRING },
    travelBookNum: { type: Sequelize.STRING },
    summaryDescription: { type: Sequelize.TEXT },
    address: { type: Sequelize.STRING },
    phone: { type: Sequelize.STRING },
    website: { type: Sequelize.STRING },
    openingHours: { type: Sequelize.STRING(1024) },
    touristsNum: { type: Sequelize.INTEGER, comment: '在园游客' },
    touristSeason: { type: Sequelize.STRING(2047) },
    trafficGuide: { type: Sequelize.TEXT },
    tips: { type: Sequelize.STRING(1024) },
    time_reference: { type: Sequelize.STRING },
    url: { type: Sequelize.STRING },
    grade_2015: { type: Sequelize.STRING(1), comment: '年度景区等级，数字几代表几级' },
    grade_2016: { type: Sequelize.STRING(1), comment: '年度景区等级' },
    grade_2017: { type: Sequelize.STRING(1), comment: '年度景区等级' },
    grade_2018: { type: Sequelize.STRING(1), comment: '年度景区等级' },
    grade_2019: { type: Sequelize.STRING(1), comment: '年度景区等级' },
    grade_2020: { type: Sequelize.STRING(1), comment: '年度景区等级' },
    type: {
      type: Sequelize.INTEGER,
      comment:
        '景区类别：1:文博院馆;2:寺庙观堂; 3:旅游度假区; 4:自然保护区; 5:主题公园; 6:森林公园; 7:地质公园; 8:游乐园; 9:动物园; 0:植物园'
    },
    today_tourists_num: { type: Sequelize.INTEGER, comment: '今日入园游客' },
    play_time: { type: Sequelize.INTEGER, comment: '平均游玩时间：分钟' },
    year_tourists_2015: { type: Sequelize.INTEGER, comment: '年游客数' },
    year_tourists_2016: { type: Sequelize.INTEGER, comment: '年游客数' },
    year_tourists_2017: { type: Sequelize.INTEGER, comment: '年游客数' },
    year_tourists_2018: { type: Sequelize.INTEGER, comment: '年游客数' },
    year_tourists_2019: { type: Sequelize.INTEGER, comment: '年游客数' },
    year_tourists_2020: { type: Sequelize.INTEGER, comment: '年游客数' },
    year_tourists_2021: { type: Sequelize.INTEGER, comment: '年游客数' }
  },
  {
    // timestamps: false, // 是否自动创建时间字段， 默认会自动创建createdAt、updatedAt
    // paranoid: false // 是否自动创建deletedAt字段
    // 写表注释
    comment: '景区信息表'
  }
);

module.exports = scenicSpot;
