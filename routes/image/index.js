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

const Jimp = require('jimp');
const { Image, createCanvas, loadImage } = require('canvas');
const delay = ms => new Promise(resolve => setTimeout(resolve, ms)); // 延时

// loadImage(path.join(pwdPath, 'transparent.png')).then(image => {
//   context.drawImage(image, 50, 0, 70, 70);

//   // console.log('<img src="' + canvas.toDataURL() + '" />');
// });
/* 滑块验证 */
// #region
/**
 * @swagger
 * /image/verify/verify:
 *   get:
 *     summary: 滑块验证
 *     description: 滑块验证
 *     tags: [图片公共模块]
 *     parameters:
 *       - name: width
 *         in: query # query/formData/path/body
 *         type: number
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
router.get('/verify/verify', async ctx => {
  const bgWidth = 320;
  const bgHeight = 180;
  const dragPicWidth = 60;
  const dragPicHeight = 45;
  const index = Math.floor(Math.random() * 8);
  const positionX = Math.floor(Math.random() * (bgWidth - dragPicWidth - 70) + 71); // 空白拼图的定位X
  const positionY = Math.floor(Math.random() * (bgHeight - dragPicHeight - 70) + 71);
  const bgCanvas = createCanvas(bgWidth, bgHeight);
  const dragCanvas = createCanvas(dragPicWidth, dragPicHeight);
  const background = bgCanvas.getContext('2d');
  const dragPic = dragCanvas.getContext('2d');

  const image = new Image();
  image.onload = () => {
    background.drawImage(image, 0, 0, bgWidth, bgHeight, 0, 0, bgWidth, bgHeight);
    dragPic.drawImage(bgCanvas, positionX, positionY, dragPicWidth, dragPicHeight, 0, 0, dragPicWidth, dragPicHeight);
    background.clearRect(positionX, positionY, dragPicWidth, dragPicHeight);
  };
  image.src = path.join(pwdPath, `/asset/${index}.jpg`);

  let imgPath = pwdPath + '/asset/sliderBG.jpg';
  base64ToImg(imgPath, bgCanvas.toDataURL());

  imgPath = pwdPath + '/asset/slider.jpg';
  base64ToImg(imgPath, dragCanvas.toDataURL());

  // 合成滑块图
  let mask = await Jimp.read(path.join(pwdPath, '/asset/slider.jpg'));
  await Jimp.read(path.join(pwdPath, '/asset/transparent.jpg'))
    .then(img => {
      return img.composite(mask, 0, positionY).writeAsync(path.join(pwdPath, '_slider.jpg'));
    })
    .catch(function (err) {
      console.error(err);
    });

  await delay(50);
  await transparent(60, 180, 10, 0, path.join(pwdPath, '_slider.jpg'), path.join(pwdPath, 'slider.jpg')); //, path.join(pwdPath, 'slider.jpg')

  const slider = imgToBase64(path.join(pwdPath, 'slider.jpg'), 60, 320);

  // 合成虚化后背景图
  const border = await Jimp.read(path.join(pwdPath, '/asset/border.png'));
  mask = await mask.blur(1);
  await Jimp.read(path.join(pwdPath, '/asset/sliderBG.jpg'))
    .then(img => {
      img
        .composite(border, positionX - 1, positionY - 1)
        .composite(mask, positionX, positionY)
        .writeAsync(path.join(pwdPath, 'sliderBG.jpg'));
    })
    .catch(function (err) {
      console.error(err);
    });

  await delay(50);
  const sliderBG = await imgToBase64(path.join(pwdPath, 'sliderBG.jpg'));

  ctx.success({
    sliderBG,
    slider,
    positionX
  });
});

module.exports = router;

/**
 * @description base64转图片
 * @param [String] imgPath 图片保存路径
 * @param [String] imgData 图片base64数据
 */
function base64ToImg(imgPath, imgData) {
  const base64 = imgData.replace(/^data:image\/\w+;base64,/, ''); //去掉图片base64码前面部分data:image/png;base64
  const dataBuffer = Buffer.from(base64, 'base64'); //把base64码转成buffer对象，
  if (Buffer.isBuffer(dataBuffer)) {
    fs.writeFileSync(imgPath, dataBuffer, function (err) {
      //用fs写入文件
      if (err) console.log(err);
    });
  } else {
    throw '非base数据！';
  }
}

/**
 * @description 图片转base64
 * @param [String] imgPath 图片路径
 * @param [Number] width 图片的宽
 * @param [Number] height 图片的高
 * @return 图片base64数据
 */
function imgToBase64(imgPath, width = 320, height = 180) {
  const canvas = createCanvas(width, height);
  const canvasCtx = canvas.getContext('2d');
  const image = new Image();
  image.onload = () => {
    canvasCtx.drawImage(image, 0, 0, width, height);
  };
  image.src = imgPath;
  return canvas.toDataURL();
}

function transparent(
  width = 320,
  height = 180,
  max = 256,
  min = 0,
  inPath,
  outPath = pwdPath + `/${new Date().getTime()}.jpg`
) {
  const img = new Image();
  img.onload = () => {
    const canvas = createCanvas(width, height);
    const context = canvas.getContext('2d');
    context.drawImage(img, 0, 0, width, height);
    let imageData = context.getImageData(0, 0, width, height),
      data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      // 得到 RGBA 通道的值
      let r = data[i];
      g = data[i + 1];
      b = data[i + 2];
      // 我们从最下面那张颜色生成器中可以看到在图片的右上角区域，有一小块在
      // 肉眼的观察下基本都是白色的，所以我在这里把 RGB 值都在 245 以上的
      // 的定义为白色
      // 大家也可以自己定义的更精确，或者更宽泛一些
      if ([r, g, b].every(v => v < max && v >= min)) data[i + 3] = 0;
    }
    // 将修改后的代码复制回画布中
    context.putImageData(imageData, 0, 0);
    const path = outPath; // 输出图片路径
    const base64 = canvas.toDataURL().replace(/^data:image\/\w+;base64,/, ''); //去掉图片base64码前面部分data:image/png;base64
    const dataBuffer = Buffer.from(base64, 'base64'); //把base64码转成buffer对象，
    // console.log('datauffer是否是Buffer对象：' + Buffer.isBuffer(dataBuffer));
    fs.writeFileSync(path, dataBuffer, function (err) {
      //用fs写入文件
      if (err) {
        console.log(err);
      } else {
        console.log('写入成功！');
      }
    });
  };
  img.src = inPath;
}

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
