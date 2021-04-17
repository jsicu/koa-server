const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('scenicSpot', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    destId: {
      type: DataTypes.STRING(64),
      allowNull: false,
      comment: "景区id",
      unique: "dest_id",
      field: 'dest_id'
    },
    destName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: "景区名称",
      field: 'dest_name'
    },
    destEnName: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "景区英文名称",
      field: 'dest_en_name'
    },
    navigationBar: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'navigation_bar'
    },
    realCity: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'real_city'
    },
    city: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    photos: {
      type: DataTypes.STRING(1024),
      allowNull: true
    },
    score: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    ranking: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    recommendPlaytime: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'recommend_playtime'
    },
    commentNum: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'comment_num'
    },
    lat: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    lng: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    travelBookNum: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'travel_book_num'
    },
    summaryDescription: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'summary_description'
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    phone: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    website: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    openingHours: {
      type: DataTypes.STRING(1024),
      allowNull: true,
      field: 'opening_hours'
    },
    touristsNum: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "在园游客",
      field: 'tourists_num'
    },
    touristSeason: {
      type: DataTypes.STRING(2047),
      allowNull: true,
      field: 'tourist_season'
    },
    trafficGuide: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'traffic_guide'
    },
    tips: {
      type: DataTypes.STRING(1024),
      allowNull: true
    },
    timeReference: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'time_reference'
    },
    url: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    grade2015: {
      type: DataTypes.STRING(1),
      allowNull: true,
      comment: "年度景区等级，数字几代表几级",
      field: 'grade_2015'
    },
    grade2016: {
      type: DataTypes.STRING(1),
      allowNull: true,
      comment: "年度景区等级",
      field: 'grade_2016'
    },
    grade2017: {
      type: DataTypes.STRING(1),
      allowNull: true,
      comment: "年度景区等级",
      field: 'grade_2017'
    },
    grade2018: {
      type: DataTypes.STRING(1),
      allowNull: true,
      comment: "年度景区等级",
      field: 'grade_2018'
    },
    grade2019: {
      type: DataTypes.STRING(1),
      allowNull: true,
      comment: "年度景区等级",
      field: 'grade_2019'
    },
    grade2020: {
      type: DataTypes.STRING(1),
      allowNull: true,
      comment: "年度景区等级",
      field: 'grade_2020'
    },
    type: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "景区类别：1:文博院馆;2:寺庙观堂; 3:旅游度假区; 4:自然保护区; 5:主题公园; 6:森林公园; 7:地质公园; 8:游乐园; 9:动物园; 0:植物园"
    },
    todayTouristsNum: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "今日入园游客",
      field: 'today_tourists_num'
    },
    playTime: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "平均游玩时间：分钟",
      field: 'play_time'
    },
    yearTourists2015: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "年游客数",
      field: 'year_tourists_2015'
    },
    yearTourists2016: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "年游客数",
      field: 'year_tourists_2016'
    },
    yearTourists2017: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "年游客数",
      field: 'year_tourists_2017'
    },
    yearTourists2018: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "年游客数",
      field: 'year_tourists_2018'
    },
    yearTourists2019: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "年游客数",
      field: 'year_tourists_2019'
    },
    yearTourists2020: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "年游客数",
      field: 'year_tourists_2020'
    },
    yearTourists2021: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "年游客数",
      field: 'year_tourists_2021'
    },
    createTime: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'create_time'
    },
    updateTime: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'update_time'
    },
    deleteTime: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'delete_time'
    }
  }, {
    sequelize,
    tableName: 'scenic_spot',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "dest_id",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "dest_id" },
        ]
      },
    ]
  });
};
