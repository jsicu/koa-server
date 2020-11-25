CREATE TABLE `log`  (
  `id` int(16) NOT NULL AUTO_INCREMENT COMMENT '主键',
  `user_id` int(10) NOT NULL COMMENT '用户id',
  `visit_time` datetime NULL COMMENT '访问时间',
  `method` varchar(8) NULL COMMENT '请求方法',
  `url` varchar(128) NULL COMMENT '接口地址',
  `request_body` varchar(255) NULL COMMENT '请求体',
  `operation` varchar(32) NULL COMMENT '操作类型',
  `result` int(1) NULL COMMENT '请求结果',
  `ip` varchar(128) NULL COMMENT 'ip地址',
  `user-agent` varchar(255) NULL COMMENT '用户代理信息',
  `err_code` int(3) NULL COMMENT '错误代码',
  PRIMARY KEY (`id`)
) COMMENT = '操作日志';

CREATE TABLE `online_token`  (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '主键',
  `token` varchar(255) NOT NULL COMMENT 'token',
  PRIMARY KEY (`id`)
) COMMENT = '在线用户token表';

CREATE TABLE `route`  (
  `id` int(10) NOT NULL COMMENT '路由id',
  `name` varchar(64) NULL COMMENT '路由名称',
  `alias` varchar(255) NULL COMMENT '路由地址',
  `icon` varchar(64) NOT NULL DEFAULT '' COMMENT '图标'
) COMMENT = '路由注册表';

CREATE TABLE `uesr_history`  (
  `id` int(16) NOT NULL AUTO_INCREMENT COMMENT '主键',
  `password` varchar(32) NULL COMMENT '历史密码',
  `update_time` datetime(0) NULL ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '修改时间',
  `user_id` int(10) NOT NULL COMMENT '用户主键',
  PRIMARY KEY (`id`)
) COMMENT = '用户账号修改历史记录';

CREATE TABLE `user`  (
  `id` int(10) NOT NULL AUTO_INCREMENT COMMENT '主键',
  `name` varchar(32) NULL COMMENT '用户名',
  `password` varchar(32) NULL COMMENT '密码',
  `create_time` datetime NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '最后一次修改时间',
  `is_cancel` tinyint(1) NULL COMMENT '是否注销',
  PRIMARY KEY (`id`)
) COMMENT = '用户表\r\n';

ALTER TABLE `log` ADD CONSTRAINT `user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);
ALTER TABLE `uesr_history` ADD CONSTRAINT `user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

