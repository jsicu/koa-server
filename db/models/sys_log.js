const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('sysLog', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    route: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: "接口地址"
    },
    userName: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "操作用户，没有可不填",
      field: 'user_name'
    },
    requestIp: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'request_ip'
    },
    requestMethod: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: "请求方式：get,post",
      field: 'request_method'
    },
    userAgent: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: "浏览器信息",
      field: 'user_agent'
    },
    accept: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    requestType: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "请求类型，curd（未使用）",
      field: 'request_type'
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "请求结果: http状态码"
    },
    resultText: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: "返回结果，成功结果为true,失败为报错提示",
      field: 'result_text'
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
    tableName: 'sys_log',
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
