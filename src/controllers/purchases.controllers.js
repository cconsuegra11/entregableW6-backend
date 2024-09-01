const catchError = require('../utils/catchError');
const Purchase = require('../models/Purchase');
const Cart = require('../models/Cart')
const Product = require('../models/Product')
const Category = require('../models/Category')

// --> GET
const getAll = catchError(async(req, res) => {
    const userId = req.user.id
    const results = await Purchase.findAll({
      where: { userId },
      include: [
        {
          model: Product,
          attributes: { exclude: ['updatedAt', 'createdAt'] },
          include: [
            {
              model: Category,
              attributes: ['name', 'id']
            }
          ]
        }
      ]
    });
    return res.json(results);
});


// --> POST
const create = catchError(async(req, res) => {
    const userId = req.user.id
    const cartProducts = await Cart.findAll({where: { userId }, include: Product})
    if (cartProducts.length === 0) throw { status: 404, message: 'You have no products in your cart.' };
    const purchasesData = cartProducts.map(item => ({
      userId,
      productId: item.productId,
      quantity: item.quantity
    }));
  
    const result = await Purchase.bulkCreate(purchasesData);
    await Cart.destroy({ where: { userId } });
    return res.status(201).json(result);
});


module.exports = {
    getAll,
    create
}