const multer = require('multer');
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
  
  const imageFormat = allowedFormats.includes(file.mimetype)

  if (!imageFormat) {
    cb(new Error('The file must be an image (jpeg, jpg, png, gif).'))
  } else {
    cb(null, true);
  }
};

const upload = multer({ storage, fileFilter })

module.exports = upload