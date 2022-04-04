const multer = require('multer');
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk');
const dotenv = require('dotenv');
const fs = require('fs');
const { path } = require('express/lib/application');
dotenv.config();

try {
  fs.readdirSync('uploads');
} catch (error) {
  console.error('creat uploads folder');
  fs.mkdirSync('uploads');
}

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cd) {
      cd(null, 'uploads/');
    },
  }),
  filename(req, file, cd) {
    const ext = path.extname(file.originalname);
    cd(null, path.basename(file.originalname, ext) + Date.now() + ext);
  },
  limits: { fileSize: 5 * 1024 * 1024 },
});

// const s3 = new AWS.S3({
//   accessKeyId: process.env.S3_KEY_ID,
//   secretAccessKey: process.env.S3_SECRET_KEY,
//   region: process.env.S3_REGION,
// });

// const storage = multerS3({
//   s3: s3,
//   bucket: process.env.S3_BUCKET_NAME,
//   contentType: multerS3.AUTO_CONTENT_TYPE,
//   acl: 'public-read',
//   metadata: function (req, file, cb) {
//     cb(null, { fieldName: file.fieldname });
//   },
//   key: function (req, file, cb) {
//     if (file.originalname.match(/\.(mp4|MPEG-4|mkv|MOV)$/)) {
//       cb(null, `reviewVideo/${Date.now()}_${file.originalname}`);
//     } else if (req.files && req.files.keyboardImg) {
//       cb(null, `keyboard/${file.originalname}`);
//     } else if (req.files && req.files.img1) {
//       cb(null, `review/${Date.now()}_${file.originalname}`);
//     } else if (req.files && req.files.img2) {
//       cb(null, `review/${Date.now()}_${file.originalname}`);
//     } else if (req.files && req.files.img3) {
//       cb(null, `review/${Date.now()}_${file.originalname}`);
//     } else {
//       cb(null, `profile/${Date.now()}_${file.originalname}`);
//     }
//   },
// });

exports.uploads = upload;
