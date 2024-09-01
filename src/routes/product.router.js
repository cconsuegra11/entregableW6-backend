const { getAll, create, getOne, remove, update } = require('../controllers/product.controllers');
const express = require('express');

const routerProduct = express.Router();

routerProduct.route('/')
    .get(getAll)
    .post(create);

routerProduct.route('/:id')
    .get(getOne)
    .delete(remove)
    .put(update);

module.exports = routerProduct;