var DataTypes = require("sequelize").DataTypes;
var _captcha = require("./captcha");
var _dictionary = require("./dictionary");
var _log = require("./log");
var _onlineToken = require("./online_token");
var _route = require("./route");
var _scenicSpot = require("./scenic_spot");
var _user = require("./user");

function initModels(sequelize) {
  var captcha = _captcha(sequelize, DataTypes);
  var dictionary = _dictionary(sequelize, DataTypes);
  var log = _log(sequelize, DataTypes);
  var onlineToken = _onlineToken(sequelize, DataTypes);
  var route = _route(sequelize, DataTypes);
  var scenicSpot = _scenicSpot(sequelize, DataTypes);
  var user = _user(sequelize, DataTypes);

  captcha.belongsTo(user, { as: "user", foreignKey: "userId"});
  user.hasMany(captcha, { as: "captchas", foreignKey: "userId"});
  onlineToken.belongsTo(user, { as: "user", foreignKey: "userId"});
  user.hasMany(onlineToken, { as: "onlineTokens", foreignKey: "userId"});

  return {
    captcha,
    dictionary,
    log,
    onlineToken,
    route,
    scenicSpot,
    user,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
