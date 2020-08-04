CREATE TABLE `online_token`  (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '主键',
  `token` varchar(255) NOT NULL COMMENT 'token',
  PRIMARY KEY (`id`)
) COMMENT = '在线用户token表';

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

ALTER TABLE `uesr_history` ADD CONSTRAINT `user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

