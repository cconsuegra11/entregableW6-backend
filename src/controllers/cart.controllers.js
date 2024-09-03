const catchError = require('../utils/catchError');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Category = require('../models/Category');


// --> GET
const getAll = catchError(async(req, res) => {
    const userId = req.user.id
    const userCart = await Cart.findAll({ where: { userId }, 
      include: [
        {
          model: Product,
          attributes: { exclude: ['createdAt', 'updatedAt']},
          include: [
            {
              model: Category,
              attributes: ['name']
            }
          ]
        }
      ]
    });
    return res.json(userCart)
});


// --> POST
const create = catchError(async(req, res) => {
    const userId = req.user.id
    const { productId, quantity } = req.body
    
    const product = await Product.findByPk(productId)
    if (!product) throw {message: 'Product not found.'}
  
    const cart = await Cart.findOne({where: { userId, productId }})
  
    if (cart) {
      cart.quantity += quantity;
      await cart.save();
      return res.json(cart);
    } else  {
      const createCart = await Cart.create({ userId, productId, quantity })
      return res.status(201).json(createCart)
    }
});


// --> GET
const getOne = catchError(async(req, res) => {
    const userId = req.user.id;
    const id = req.params.id

    const cart = await Cart.findByPk(id , {
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
    if(!cart) return res.sendStatus(404)
    return res.json(cart)
});


// --> DELETE
const remove = catchError(async(req, res) => {
    const userId = req.user.id
    const deleteCart = await Cart.destroy({ where: {userId} })
    if(!deleteCart) return res.sendStatus(404)
    return res.sendStatus(204)
});


// --> PUT
const update = catchError(async(req, res) => {
    const userId = req.user.id
    const { id } = req.params
    const { quantity } = req.body
    const body = {id, userId}
    const userUpdate = await Cart.update(
        {quantity},
        { where: body, returning: true }
    );
    if(userUpdate[0] === 0) return res.sendStatus(404);
    return res.json(userUpdate[1][0]);
});

module.exports = {
    getAll,
    create,
    getOne,
    remove,
    update
}