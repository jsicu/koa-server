const mysql = require('../mysql');
const router = require('koa-router')();
const paramCheck = require('../tool/paramCheck');

router.prefix('/security');