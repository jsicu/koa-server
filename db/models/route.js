const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('route', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(64),
      allowNull: false,
      comment: "路由名称"
    },
    alias: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: "路由地址"
    },
    icon: {
      type: DataTypes.STRING(64),
      allowNull: true,
      comment: "图标"
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      comment: "路由状态。0：失效；1：有效"
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
    tableName: 'route',
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
