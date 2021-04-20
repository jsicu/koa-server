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
