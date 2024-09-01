const { getAll, remove, uploadImg } = require('../controllers/productImg.controllers');
const express = require('express');
const upload= require('../utils/uploadFiles')

const routerProductImg = express.Router();

routerProductImg.route('/')
    .get(getAll)
    .post(upload.single('image'), uploadImg);

routerProductImg.route('/:id')
    .delete(remove)

module.exports = routerProductImg;