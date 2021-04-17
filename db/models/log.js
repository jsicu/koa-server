const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('log', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    type: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "日志类型"
    },
    ip: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: "访问地址"
    },
    userId: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "用户id",
      field: 'user_id'
    },
    method: {
      type: DataTypes.STRING(10),
      allowNull: true,
      comment: "请求方法"
    },
    originalUrl: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "请求接口",
      field: 'original_url'
    },
    token: {
      type: DataTypes.STRING(500),
      allowNull: false,
      comment: "token"
    },
    point: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "坐标"
    },
    address: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "所在地"
    },
    deleteTime: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'delete_time'
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
    }
  }, {
    sequelize,
    tableName: 'log',
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
    ]
  });
};
