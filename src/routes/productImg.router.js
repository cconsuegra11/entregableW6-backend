const { getAll, create, getOne, remove, update } = require('../controllers/productImg.controllers');
const express = require('express');

const routerProductImg = express.Router();

routerProductImg.route('/')
    .get(getAll)
    .post(create);

routerProductImg.route('/:id')
    .get(getOne)
    .delete(remove)
    .put(update);

module.exports = routerProductImg;