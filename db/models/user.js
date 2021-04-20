const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user', {
    id: {
      type: DataTypes.STRING(64),
      allowNull: false,
      primaryKey: true,
      comment: "主键"
    },
    userName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: "用户名，唯一",
      unique: "user_name",
      field: 'user_name'
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: "密码"
    },
    isCancel: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0,
      comment: "状态 0：有效，1：失效",
      field: 'is_cancel'
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
    tableName: 'user',
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
        name: "id",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "user_name",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "user_name" },
        ]
      },
    ]
  });
};
