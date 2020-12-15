const NodeRSA = require('node-rsa'); // rsa加密
const key = new NodeRSA({ b: 512 });
key.setOptions({ encryptionScheme: 'pkcs1' });
// console.log(key);
module.exports = { key };
