const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('onlineToken', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    token: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: "用户token"
    },
    userId: {
      type: DataTypes.STRING(64),
      allowNull: false,
      comment: "用户主键",
      references: {
        model: 'user',
        key: 'id'
      },
      field: 'user_id'
    },
    createTime: {
      type: DataTypes.DATE(6),
      allowNull: false,
      comment: "创造时间",
      field: 'create_time'
    },
    updateTime: {
      type: DataTypes.DATE(6),
      allowNull: false,
      defaultValue: "0162-09-12 09:32:46.000000",
      comment: "最后更新时间",
      field: 'update_time'
    },
    deleteTime: {
      type: DataTypes.DATE(6),
      allowNull: true,
      comment: "删除时间",
      field: 'delete_time'
    }
  }, {
    sequelize,
    tableName: 'online_token',
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
