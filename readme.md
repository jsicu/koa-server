# 演示项目开源版（后端代码）

### 项目介绍

该项目是基于koa2 + vue 的前后端分离的中后台管理系统，前后端源码完全开源，可二次开发，可学习可商用，让您快速搭建个性化独立网站。

- [在线预览](http://demo.udoudou.cn/#/login?redirect=%2F)
- [介绍文档](https://blog.csdn.net/qq_38734862/category_10091564.html?spm=1001.2014.3001.5482)
- [前端代码](https://gitee.com/jsicu/vue-client)

```markdown
如果对您有帮助，您可以点右上角 “Star” 收藏一下 ，获取第一时间更新，谢谢！
```



### 功能

```
- 登录 / 注销
- token权限验证
- 系统日志文件
- swagger文档
- Sequelize映射
- 邮件功能
- 异常处理
```



### 启动项目

#### 必备条件

- node >= 10.0.0
-  mysql 数据库>= 8.0
-  redis



#### 其他依赖

```shell
// 这是用来导出数据库已有表模型时需要的依赖
npm i -g sequelize sequelize-auto mysql2
```



#### 了解目录结构

打开[treer.md](./treer.me)文件，查看项目目录结构，让你更快的使用或修改



#### 安装依赖

```shell
# 克隆项目
git clone https://gitee.com/jsicu/koa-server.git

// # 建议不要直接使用 cnpm 安装依赖，会有各种诡异的 bug。可以通过如下操作解决 npm 下载速度慢的问题
npm install --registry=https://registry.npm.taobao.org
```



#### 数据库创建

在这我使用sequelize库创建数据库模型，步骤如下：

- 首先在安装mysql8.0+数据库，新增数据库，将数据库名称、账号、密码更新到**./db/db.js**
- 控制台输入：node dbSync.js 同步数据库模型，此时在数据库里就创建了几个基本的表
- 使用navicat或者其他工具在新建好的数据库中插入数据，数据插入指令在**./data.sql** 中，直接复制到navicat的查询中运行即可



#### 运行项目

```shell
npm run start
```



#### 打开swagger

如果启动没报错，可以在浏览器输入：http://localhost:4000/swagger 查看服务swagger文档



### 注意事项及问题

[Q&A.md](./Q&A.md)



### License

[MIT](https://github.com/jsicu/koa-server/blob/master/LICENSE)

Copyright (c) 2020-present linzhongqi






