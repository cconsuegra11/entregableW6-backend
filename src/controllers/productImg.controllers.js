const catchError = require('../utils/catchError');
const ProductImg = require('../models/ProductImg');
const Product = require('../models/Product');
const uploadToCloudinary = require('../utils/uploadFiledCloudinary');

// --> GET
const getAll = catchError(async(req, res) => {
    const results = await ProductImg.findAll();
    return res.json(results);
});


// --> DELETE
const remove = catchError(async(req, res) => {
    const { id } = req.params;
    const result = await ProductImg.destroy({ where: {id} });
    if(!result) return res.sendStatus(404);
    return res.sendStatus(204);
});


const uploadImg = catchError(async(req, res) => {
    const { productId } = req.body;
    const product = await Product.findByPk(productId);
    if (!product) throw { status: 404,  message: 'Product not found' };
   
    if (!req.file) throw { status: 400, message: 'No file uploaded'}
     
    const file = req.file
    const uploadResult = await uploadToCloudinary(file.buffer);
    const result = await ProductImg.create({ url: uploadResult.secure_url, fileName: uploadResult.public_id, productId });
    return res.status(201).json(result);
  });

module.exports = {
    getAll,
    remove,
    uploadImg
}