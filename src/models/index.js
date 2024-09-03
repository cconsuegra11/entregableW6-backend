const Cart = require("./Cart")
const Category = require("./Category")
const Product = require("./Product")
const ProductImg = require("./ProductImg")
const Purchase = require("./Purchase")
const User = require("./User")

Category.hasMany(Product)
Product.belongsTo(Category)

Cart.belongsTo(User)
User.hasMany(Cart)

Cart.belongsTo(Product)
Product.hasMany(Cart)

Purchase.belongsTo(User)
User.hasMany(Purchase)

Purchase.belongsTo(Product)
Product.hasMany(Purchase)

Product.hasMany(ProductImg)
ProductImg.belongsTo(Product)
