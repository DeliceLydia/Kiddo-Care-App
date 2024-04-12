const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'profilePicture') {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG and PNG files are allowed for profile pictures'), false);
    }
  } else if (file.fieldname === 'uploadFile') {
    if (file.mimetype === 'application/pdf' ||
        file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and DOCx files are allowed for document uploads'), false);
    }
  } else {
    cb(new Error('Unexpected field for file upload'), false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

module.exports = {
  upload
};
