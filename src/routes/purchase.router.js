const { getAll, create, getOne, remove, update } = require('../controllers/purchases.controllers');
const express = require('express');

const routerPurchases = express.Router();

routerPurchases.route('/')
    .get(getAll)
    .post(create);


module.exports = routerPurchases;