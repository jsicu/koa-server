const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('unitDivision', {
    divisionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      comment: "所在地ID",
      field: 'division_id'
    },
    divisionCode: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: "所在地编码",
      field: 'division_code'
    },
    divisionName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: "所在地名称",
      field: 'division_name'
    },
    fullName: {
      type: DataTypes.STRING(200),
      allowNull: true,
      comment: "详细地址",
      field: 'full_name'
    },
    divisionLevel: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "所在地等级（1省\/2市\/3区县）",
      field: 'division_level'
    },
    parentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: "父ID",
      field: 'parent_id'
    },
    sort: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "排序"
    },
    remark: {
      type: DataTypes.STRING(200),
      allowNull: true,
      comment: "备注"
    },
    createTime: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: "创建时间",
      field: 'create_time'
    },
    updateTime: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: "更新时间",
      field: 'update_time'
    },
    deleted: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: "是否删除（1是\/0否）"
    }
  }, {
    sequelize,
    tableName: 'unit_division',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "division_id" },
        ]
      },
      {
        name: "index_divison_id",
        using: "BTREE",
        fields: [
          { name: "division_id" },
        ]
      },
      {
        name: "index_division_name",
        using: "BTREE",
        fields: [
          { name: "division_name" },
        ]
      },
      {
        name: "index_division_code",
        using: "BTREE",
        fields: [
          { name: "division_code" },
        ]
      },
      {
        name: "index_full_name",
        type: "FULLTEXT",
        fields: [
          { name: "full_name" },
        ]
      },
    ]
  });
};
