const { getAll, create, getOne, remove, update } = require('../controllers/category.controllers');
const express = require('express');
const verifyJwt = require('../utils/verifyJwt')

const routerCategory = express.Router();

routerCategory.route('/')
    .get(getAll)
    .post(verifyJwt, create);

routerCategory.route('/:id')
    .delete(verifyJwt, remove);

module.exports = routerCategory;