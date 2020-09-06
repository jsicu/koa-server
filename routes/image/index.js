// const mysql = require('../../mysql');
const router = require('koa-router')();
// const paramCheck = require('../utils/paramCheck');
const utils = require('../../utils/');
const fs = require('fs');
const path = require('path');
const qr = require('qr-image');
const send = require('koa-send');

router.prefix('/image');

// 日志根目录
const pwdPath = path.resolve(__dirname);

// #region
/**
 * @swagger
 * /image/{id}:
 *   get:
 *     summary: Returns a list of users.
 *     description: 图片测试
 *     tags: [图片公共模块]
 *     parameters:
 *       - name: id
 *         description: 用户id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       '200':
 *         description: Ok
 *         schema:
 *           type: 'object'
 *           properties:
 *             code:
 *               type: 'number'
 *             data:
 *               type: 'object'
 *               description: 返回数据
 *             message:
 *               type: 'string'
 *               description: 消息提示
 *       '400':
 *         description: 请求参数错误
 *       '404':
 *         description: not found
 */
// #endregion

router.get('/:id', (ctx, next) => {
  // console.log(ctx.params);
  const obj = ctx.params;
  const url = path.join(pwdPath, `assets/${obj.id}.png`);
  const img = qr.image(obj.id, { type: 'png' });
  img.pipe(fs.createWriteStream(url));
  // 验证文件系统是否存在
  const res = ctx.checkPath(url);
  if (res) {
    ctx.success(true);
  }
  //  删除文件
  // fs.unlink(url, err => {
  //   if (err) throw err;
  //   console.log('文件已被删除');
  // });
});

// 图片下载
router.get('/download/:name', async ctx => {
  const name = ctx.params.name;
  const token = ctx.query.token;
  if (!ctx.checkToken(token)) {
    return ctx.error([0, '令牌已过期！']);
  }
  const path = `routes/image/${name}.png`; // routes\image\1.png
  // ctx.attachment(path);
  await send(ctx, path);
});

// #region
/**
 * @swagger
 * /image/download:
 *   post:
 *     summary: 图片上传
 *     description: 图片上传
 *     tags: [图片公共模块]
 *     parameters:
 *       - name: file
 *         in: formData # query/formData/path/body
 *         type: string
 *     responses:
 *       '200':
 *         description: Ok
 *         schema:
 *           type: 'object'
 *           properties:
 *             code:
 *               type: 'number'
 *             data:
 *               type: 'object'
 *               description: 返回数据
 *             message:
 *               type: 'string'
 *               description: 消息提示
 *       '400':
 *         description: 请求参数错误
 *       '404':
 *         description: not found
 */
// #endregion
const multer = require('@koa/multer'); // 加载@koa/multer模块

const storage = multer.diskStorage({
  // multer调用diskStorage可控制磁盘存储引擎
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/');
  },
  filename: function (req, file, cb) {
    // cb(null, file.fieldname + '-' + Date.now()); // 文件名使用cb回调更改，参数二是文件名，为了保证命名不重复，使用时间戳 二进制保存
    const fileFormat = file.originalname.split('.');
    cb(null, Date.now() + '.' + fileFormat[fileFormat.length - 1]);
  }
});
const upload = multer({ storage }); // upload.single('file'),

router.post('/download', upload.single('file'), async ctx => {
  if (ctx.file.size > 204800) {
    return ctx.error([0, '最大允许图片大小200k']);
  }
  // console.log('ctx.request.file', ctx.request.file);
  // console.log('ctx.file', ctx.file); // 可以获取保存的图片信息
  // TODO: 修改图片名称、账号对应多个图片功能、假删除功能、前台获取图片功能
  const base64Data = imgToBase64(path.join(process.cwd(), ctx.file.path)).replace(/^data:image\/\w+;base64,/, '');
  // eslint-disable-next-line no-undef
  const dataBuffer = Buffer.from(base64Data, 'base64');
  fs.writeFile('image.jpg', dataBuffer, err => {
    if (err) return ctx.error([0, err]);
  });
  ctx.success(true);
});

// #region
/**
 * @swagger
 * /image/upload:
 *   post:
 *     summary: 图片上传
 *     description: 图片上传
 *     tags: [图片公共模块]
 *     parameters:
 *       - name: file
 *         in: formData
 *         type: file
 *     responses:
 *       '200':
 *         description: Ok
 *         schema:
 *           type: 'object'
 *           properties:
 *             code:
 *               type: 'number'
 *             data:
 *               type: 'object'
 *               description: 返回数据
 *             message:
 *               type: 'string'
 *               description: 消息提示
 *       '400':
 *         description: 请求参数错误
 *       '404':
 *         description: not found
 */
// #endregion
router.post('/upload', async ctx => {
  const file = ctx.request;
  console.log(file);
  ctx.success(true);
});

module.exports = router;

/* 方法 */
const mimeType = require('mime-types'); // 获取文件类型
function imgToBase64(file) {
  const filePath = path.resolve(file); // 原始文件地址
  const fileName = filePath.split('\\').slice(-1)[0].split('.'); // 提取文件名
  const fileMimeType = mimeType.lookup(filePath); // 获取文件的 memeType

  // 如果不是图片文件，则退出
  if (!fileMimeType.toString().includes('image')) {
    return;
  }

  // 读取文件数据
  let data = fs.readFileSync(filePath);
  data = Buffer.from(data).toString('base64');

  // 转换为 data:image/jpeg;base64,***** 格式的字符串
  const base64 = 'data:' + fileMimeType + ';base64,' + data;
  return base64;
}

/** 方法说明
 * @method 文件大小判断
 * @for 通用工具类
 * @param Number size 文件大小
 * @param Number maxSize 最大尺寸
 * @return Boolean
 */
function maxFileSize(size, maxSize) {
  return true;
}
