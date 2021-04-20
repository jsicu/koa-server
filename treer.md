F:\koa-server
├─.editorconfig
├─.eslintrc.js
├─.prettierrc
├─app.js // 项目入口
├─dbSync.js // 数据库模型同步脚本
├─data.sql // 基础运行数据，账号路由，可视化数据
├─LICENSE
├─mysql.js // 数据库操作，后期使用Sequelize.js
├─package-lock.json
├─package.json
├─readme.md
├─treer.md  // 目录结构介绍
├─views
|   ├─error.pug
|   ├─index.pug
|   └layout.pug
├─utils // 公共函数文件夹
|   ├─encryption.js
|   ├─logs.js
|   └paramCheck.js
├─static // 静态文件夹
├─routes //路由，api服务接口
|   ├─common.js
|   ├─index.js
|   ├─security.js
|   ├─image
|   |   ├─index.js
|   |   ├─sql.js
|   |   ├─validationData.js
|   |   ├─assets
|   |   ├─asset
|   ├─bigScreen
|   |     ├─index.js
|   |     └sql.js
├─public
|   ├─stylesheets
|   |      └style.css
├─middleware // 中间件
|     ├─index.js
|     ├─token
|     |   ├─index.js
|     |   ├─rsa_private_key.pem
|     |   ├─rsa_public_key.pem
|     |   └token.js
|     ├─response
|     |    ├─index.js
|     |    └response.js
|     ├─log
|     |  ├─index.js
|     |  └log.js
|     ├─errorHandler
|     |      └index.js
├─logs // 日志系统
|  ├─response
|  ├─handle
|  ├─error
|  ├─console
├─db // Sequelize数据库模型
| ├─db.js
| ├─index.js
| ├─model // 数据库模型
| |   ├─captcha.js
| |   ├─dictionary.js
| |   ├─onlineToken.js
| |   ├─route.js
| |   ├─scenicSpot.js
| |   └user.js
├─core // 核心文件夹
|  ├─http-exception.js
|  ├─init.js
|  └tableList.js
├─config // 配置信息文件夹
|   ├─config.js
|   ├─logs.js
|   ├─nodemailer.js
|   ├─sql.json // 数据库参数
|   └swagger.js
├─bin
|  └www