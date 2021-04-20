/*
 * @Author: linzq
 * @Date: 2021-04-19 11:44:13
 * @LastEditors: linzq
 * @LastEditTime: 2021-04-20 17:29:39
 * @Description:
 */
const { redis: redisCfg } = require('@config');
const redis = require('redis');
const client = redis.createClient(redisCfg); // 端口号、主机
const logsUtil = require('../utils/logs.js'); // 日志文件

// 配置redis的监听事件
// 准备连接redis-server事件
client.on('ready', () => {
  console.log('Redis client: ready');
});

// 连接到redis-server回调事件
client.on('connect', () => {
  console.log(new Date(), 'redis is now connected!');
});

client.on('reconnecting', (...arg) => {
  console.log(new Date(), 'redis reconnecting', arg);
});

client.on('end', () => {
  console.log('Redis Closed!');
});

client.on('warning', (...arg) => {
  console.log('Redis client: warning', arg);
});

client.on('error', err => {
  logsUtil.logError(err, 'redis');
});
/**
 * redis setString function
 * @param key
 * @param value
 * @param expire
 */
const setString = (key, value, expire) => {
  return new Promise((resolve, reject) => {
    client.set(key, value, (err, result) => {
      if (err) {
        logsUtil.logError(err, 'redis.warn');
        reject(err);
      }

      if (!isNaN(expire) && expire > 0) {
        client.expire(key, parseInt(expire));
      }
      resolve(result);
    });
  });
};
/**
 * redis setnxString function
 * @param key
 * @param value
 * @param expire
 */
const setnxString = (key, value, expire) => {
  return new Promise((resolve, reject) => {
    client.setnx(key, value, (err, result) => {
      if (err) {
        logsUtil.logError(err, 'redis.warn');
        reject(err);
      }

      if (!isNaN(expire) && expire > 0) {
        client.expire(key, parseInt(expire));
      }
      resolve(result);
    });
  });
};

/**
 * redis getString function
 * @param key
 */
const getString = key => {
  return new Promise((resolve, reject) => {
    client.get(key, (err, result) => {
      if (err) {
        logsUtil.logError(err, 'redis.warn');
        reject(err);
      }
      resolve(result);
    });
  });
};

/**
 * redis expString function
 * @param key
 */
const expString = key => {
  return new Promise((resolve, reject) => {
    client.get(key, (err, result) => {
      if (err) {
        logsUtil.logError(err, 'redis.warn');
        reject(err);
      }
      client.expire(key, parseInt(-1));
      resolve(result);
    });
  });
};

/**
 * redis delString function
 * @param key
 */
const delString = key => {
  return new Promise((resolve, reject) => {
    client.get(key, (err, result) => {
      if (err) {
        logsUtil.logError(err, 'redis.warn');
        reject(err);
      }
      client.expire(key, parseInt(-1));
      resolve(result);
    });
  });
};
/**
 * redis existsString function
 * @param key
 */
const existsString = key => {
  return new Promise((resolve, reject) => {
    client.get(key, (err, result) => {
      if (err) {
        logsUtil.logError(err, 'redis.warn');
        reject(err);
      }
      client.expire(key, parseInt(-1));
      resolve(result);
    });
  });
};

/**
 * redis allKeys function
 * @param key
 */
const allKeys = key => {
  return new Promise((resolve, reject) => {
    client.keys('*', (err, result) => {
      if (err) {
        logsUtil.logError(err, 'redis.warn');
        reject(err);
      }
      resolve(result);
    });
  });
};

/**
 * redis flushdb  function
 * @param key
 */
const flushdbAll = key => {
  return new Promise((resolve, reject) => {
    client.flushdb((err, result) => {
      if (err) {
        logsUtil.logError(err, 'redis.warn');
        reject(err);
      }
      resolve(result);
    });
  });
};

module.exports = {
  getString,
  setString,
  setnxString,
  expString,
  delString,
  existsString,
  allKeys,
  flushdbAll
};
