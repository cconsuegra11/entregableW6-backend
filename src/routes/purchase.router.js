const { getAll, create } = require('../controllers/purchases.controllers');
const express = require('express');

const routerPurchases = express.Router();

routerPurchases.route('/')
    .get(getAll)
    .post(create);


module.exports = routerPurchases;