const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('dictionary', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    dictId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "字典id",
      field: 'dict_id'
    },
    label: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: "字典名称"
    },
    value: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "值"
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
    tableName: 'dictionary',
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
