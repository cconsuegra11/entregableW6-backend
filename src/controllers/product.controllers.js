const catchError = require('../utils/catchError');
const Product = require('../models/Product');
const Category = require('../models/Category')
const ProductImg = require('../models/ProductImg')

// --> GET
const getAll = catchError(async(req, res) => {
    const results = await Product.findAll({ include: [Category, ProductImg]});
    return res.json(results);
});


// --> POST
const create = catchError(async(req, res) => {
    const { title, description, price, categoryId } = req.body
    const body = { title, description, price, categoryId }
    const newPruduct = await Product.create(body)
    return res.status(201).json(newPruduct)
});


// --> GET
const getOne = catchError(async(req, res) => {
    const { id } = req.params;
    const result = await Product.findByPk(id, { include: [Category, ProductImg]});
    if(!result) return res.sendStatus(404);
    return res.json(result);
});


// --> DELETE
const remove = catchError(async(req, res) => {
    const { id } = req.params;
    const result = await Product.destroy({ where: {id} });
    if(!result) return res.sendStatus(404);
    return res.sendStatus(204);
});


// --> PUT
const update = catchError(async(req, res) => {
    const { id } = req.params
    const { title, description, price, categoryId } = req.body
    const body = { title, description, price, categoryId }
    const result = await Product.update(
        body,
        { where: {id}, returning: true }
    );
    if(result[0] === 0) return res.sendStatus(404)
    return res.json(result[1][0]);
});

module.exports = {
    getAll,
    create,
    getOne,
    remove,
    update
}