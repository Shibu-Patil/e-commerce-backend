const multer = require('multer');
const path = require('path');
const fs = require('fs');

// ensure uploads folder exists
const uploadPath = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // temp name; will rename after saving user to get _id
    const ext = path.extname(file.originalname);
    const tempName = 'temp_' + Date.now() + ext;
    cb(null, tempName);
  }
});

const fileFilter = (req, file, cb) => {
  const types = /jpeg|jpg|png|gif/;
  const ext = types.test(path.extname(file.originalname).toLowerCase());
  const mime = types.test(file.mimetype);
  if (ext && mime) cb(null, true);
  else cb(new Error('Only image files allowed!'), false);
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
