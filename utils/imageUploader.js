const path = require('path');
const express = require('express');
const multer = require('multer');

//Setting storage engine
const storageEngine = multer.diskStorage({
  destination: './images',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}--${file.originalname}`);
  },
});

const checkFileType = function (file, cb) {
  //Allowed ext
  const fileTypes = /jpeg|jpg|png|gif|svg/;

  //check ext
  const extName = fileTypes.test(path.extname(file.originalname));

  const mimeType = fileTypes.test(file.mimetype);

  if (mimeType && extName) {
    return cb(null, true);
  }
  cb('Error: You can Upload Images Only!!');
};
//Initializing upload
const upload = multer({
  storage: storageEngine,
  limits: { fileSize: 10000000 },
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
});

module.exports = upload;
