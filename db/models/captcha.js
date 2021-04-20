const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('captcha', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    userId: {
      type: DataTypes.STRING(64),
      allowNull: false,
      comment: "用户表主键，未限制一人一地登录",
      references: {
        model: 'user',
        key: 'id'
      },
      field: 'user_id'
    },
    type: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "验证类型，0：滑块拼图；1：点击验证"
    },
    checkJson: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: "验证数据",
      field: 'check_json'
    },
    uuId: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: "唯一验证",
      field: 'uu_id'
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
    tableName: 'captcha',
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
        name: "user_id",
        using: "BTREE",
        fields: [
          { name: "user_id" },
        ]
      },
    ]
  });
};
