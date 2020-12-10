// const mysql = require('../../mysql');
const router = require('koa-router')();
const fs = require('fs');
const path = require('path');
const qr = require('qr-image');
const send = require('koa-send');
const Joi = require('joi'); // 参数校验

router.prefix('/image');

// 日志根目录
const pwdPath = path.resolve(__dirname);
let sliderLeft = 0; // 滑块移动距离
let position = []; // 点击文字坐标位置

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

const { Image, createCanvas, loadImage } = require('canvas');
const delay = ms => new Promise(resolve => setTimeout(resolve, ms)); // 延时

const w = 40; // 正方形边长
const r = 8; // 圆形直径
const PI = Math.PI;
const L = w + r * 2 + 3; // 滑块实际边长

// #region
/**
 * @swagger
 * /image/verify/puzzle:
 *   get:
 *     summary: 滑块拼图
 *     description: 滑块验证
 *     tags: [图片公共模块]
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
router.get('/verify/puzzle', async ctx => {
  const width = 320;
  const height = 180;
  const index = Math.floor(Math.random() * 8);
  const bgCanvas = createCanvas(width, height);
  const dragCanvas = createCanvas(width, height);
  const background = bgCanvas.getContext('2d');
  const dragPic = dragCanvas.getContext('2d');

  const image = new Image();
  image.onload = () => {
    // 随机位置创建拼图形状
    const X = getRandomNumberByRange(L + 10, width - (L + 10));
    sliderLeft = X - 3;
    const Y = getRandomNumberByRange(10 + r * 2, height - (L + 10));
    drawPath(background, X, Y, 'fill');
    drawPath(dragPic, X, Y, 'clip');

    // 画入图片
    background.drawImage(image, 0, 0, width, height);
    dragPic.drawImage(image, 0, 0, width, height);

    // 提取滑块并放到最左边
    const y = Y - r * 2 - 1;
    const ImageData = dragPic.getImageData(X - 3, y, L, L);
    dragPic.putImageData(ImageData, 0, y);
    dragPic.drawImage(image, 0, 0, 65, 180);
  };
  image.onerror = err => {
    console.error(err);
  };
  image.src = path.join(pwdPath, `/asset/${index}.jpg`);

  const sliderCanvas = createCanvas(65, 180);
  const slider = sliderCanvas.getContext('2d');
  const sliderImg = new Image();
  sliderImg.onload = () => {
    slider.drawImage(sliderImg, 0, 0, 65, 180, 0, 0, 65, 180);
  };
  image.onerror = err => {
    console.error(err);
  };
  sliderImg.src = dragCanvas.toDataURL();

  ctx.success({
    sliderBG: bgCanvas.toDataURL(),
    slider: sliderCanvas.toDataURL()
  });
});

// #region
/**
 * @swagger
 * /image/verify/point:
 *   get:
 *     summary: 点击验证
 *     description: 点击验证
 *     tags: [图片公共模块]
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
router.get('/verify/point', async ctx => {
  const { colorList, wordsList } = require('./validationData');

  position = [];
  const width = 320;
  const height = 180;
  const index = Math.floor(Math.random() * 4);
  const bgCanvas = createCanvas(width, height);
  const background = bgCanvas.getContext('2d');
  const wIndex = Math.floor(Math.random() * wordsList.length - 7);
  const words = wordsList.substring(wIndex, wIndex + 7);
  const str = words
    .replace(/[。|，|；|、|\n]/g, '')
    .split('')
    .slice(0, 3);
  console.log(words);
  console.log(str);

  const image = new Image();
  image.onload = () => {
    background.drawImage(image, 0, 0, width, height);
    background.font = 'bold 22px Microsoft YaHei';
    let len = 0;
    // 随机位置创建拼图形状
    for (let i = 0; i < words.length; i++) {
      const X = getRandomNumberByRange(20, width - 20);
      const Y = getRandomNumberByRange(20, height - 20);
      const cIndex = Math.floor(Math.random() * 13);
      const angle = getRandomNumberByRange(-90, 90);

      if (words[i] == str[len] && len <= str.length) {
        position.push({ X, Y, word: str[len], angle });
        len++;
      }
      // console.log(X, Y);
      background.translate(X, Y); // 将画布的原点移动到正中央
      background.rotate((angle * PI) / 180);
      // 文字颜色
      background.fillStyle = colorList[cIndex];
      // 文字在画布的位置
      background.fillText(words[i], 0, 0);
      background.rotate((-angle * PI) / 180);
      background.translate(-X, -Y); // 将画布的原点移动到正中央
    }
  };
  image.onerror = err => {
    console.error(err);
  };
  image.src = path.join(pwdPath, `/asset/${index}.png`);

  base64ToImg(path.join(pwdPath, 'test.png'), bgCanvas.toDataURL());

  ctx.success({
    bgCanvas: bgCanvas.toDataURL(),
    words: str.join('、'),
    size: { width, height },
    position
  });
});

const { key } = require('../../utils/encryption');

// #region
/**
 * @swagger
 * /image/check:
 *   post:
 *     summary: 验证
 *     description: 滑块验证
 *     tags: [图片公共模块]
 *     parameters:
 *       - name: type
 *         description: 验证类型（滑块0或点击1）
 *         in: formData
 *         type: number
 *       - name: captcha
 *         description: 加密后验证数据
 *         in: formData
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
router.post('/check', async ctx => {
  const data = ctx.request.body;
  if (!data.checkJson) return ctx.error([400, 'checkJson is required!']);

  // const checkJson = Number(data.checkJson.replace(/\s+/g, '+')) + 4; // 防止公钥有空格存在
  let checkJson = data.checkJson.replace(/\s+/g, '+'); // 防止公钥有空格存在

  let result = false;
  const R = 16; // 根据字体大小计算得到：22px R = Math.round(2 * 11^2)
  if (data.captchaType === 0 || data.captchaType) {
    // 点击验证
    // checkJson = key.decrypt(checkJson, 'utf8');
    checkJson = JSON.parse(checkJson);
    for (const i in position) {
      const element = position[i];
      const radian = ((element.angle + 45) * PI) / 180;
      if (element.angle > 45) {
        position[i].X -= Math.round(R * Math.cos(radian));
        position[i].Y += Math.round(R * Math.sin(radian));
      } else if (element.angle < -45) {
        position[i].X += Math.round(R * Math.sin(radian));
        position[i].Y -= Math.round(R * Math.cos(radian));
      } else {
        position[i].X += Math.round(R * Math.sin(radian));
        position[i].Y -= Math.round(R * Math.cos(radian));
      }
      const dx = Math.abs(position[i].X - checkJson[i].x);
      const dy = Math.abs(position[i].Y - checkJson[i].y);
      const distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
      //  TODO: 还有错
      if (distance > 20) {
        result = false;
      } else if (i == position.length - 1) {
        result = true;
      }
      console.log(result);
      console.log(distance);
    }
    console.log(position);
    console.log(checkJson);
  } else {
    // 滑块验证
    /**
     *  由于使用公用的key,所以每编译一次key就改变一次
     *  导致解密时容易解密失败报错
     */
    checkJson = Number(key.decrypt(checkJson, 'utf8')) + 4; // 解密
    Math.abs(checkJson - sliderLeft) < 4 ? (result = true) : (result = false);
  }
  ctx.success(result);
});

module.exports = router;

/**
 * 方法说明
 * @method 绘制滑块拼图背景及滑块
 * @param [Canvas] ctx 图片画布
 * @param [Number] x 滑块X轴
 * @param [Number] y 滑块y轴
 * @param [String] operation 操作类型（是背景或是滑块）
 * @return
 */
function drawPath(ctx, x, y, operation) {
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.arc(x + w / 2, y - r + 2, r, 0.72 * PI, 2.26 * PI);
  ctx.lineTo(x + w, y);
  ctx.arc(x + w + r - 2, y + w / 2, r, 1.21 * PI, 2.78 * PI);
  ctx.lineTo(x + w, y + w);
  ctx.lineTo(x, y + w);
  ctx.arc(x + r - 2, y + w / 2, r + 0.4, 2.76 * PI, 1.24 * PI, true);
  ctx.lineTo(x, y);
  ctx.lineWidth = 2;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.stroke();
  ctx.globalCompositeOperation = 'destination-over';
  operation === 'fill' ? ctx.fill() : ctx.clip();
}

function getRandomNumberByRange(start, end) {
  return Math.round(Math.random() * (end - start) + start);
}

/**
 * @description base64转图片
 * @param [String] imgPath 图片保存路径
 * @param [String] imgData 图片base64数据
 */
function base64ToImg(imgPath, imgData) {
  const base64 = imgData.replace(/^data:image\/\w+;base64,/, ''); // 去掉图片base64码前面部分data:image/png;base64
  const dataBuffer = Buffer.from(base64, 'base64'); // 把base64码转成buffer对象，
  if (Buffer.isBuffer(dataBuffer)) {
    fs.writeFileSync(imgPath, dataBuffer, err => {
      // 用fs写入文件
      if (err) console.log(err);
    });
  } else {
    throw new Error('非base数据！');
  }
}

const mimeType = require('mime-types'); // 获取文件类型
const { number } = require('joi');
/**
 * @description 图片转base64
 * @param [String] file 图片路径
 * @return 图片base64数据
 */
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
