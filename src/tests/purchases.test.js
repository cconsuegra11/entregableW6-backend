require('../models')
const request = require('supertest')
const Category = require('../models/Category')
const Product = require('../models/Product')
const Cart = require('../models/Cart')
const app = require('../app.js')

const BASE_URL = '/api/v1/purchases'
const BASE_URL_LOGIN = '/api/v1/users/login'
let TOKEN
let purchaseId
let productId
let category
let product
let cartId
let userId
let cart

beforeAll(async () => {
  const user = {
    email: "carmen@gmail.com",
    password: "carmen1234",
  }
  const res = await request(app)
    .post(BASE_URL_LOGIN)
    .send(user)
  TOKEN = res.body.token
  userId = res.body.id
  category = await Category.create({ name: 'fashion' })

  const newProduct = {
    title: 'Red High Heels',
    description: 'Elegant red high heels, perfect for formal occasions.',
    price: 45.30,
    categoryId: category.id 
  }

  product =  await Product.create(newProduct)
  productId = product.id

  cart = await Cart.create({
    userId,
    productId,
    quantity: 5
  })

  cartId = cart.id
})

afterAll((async () => {
  await category.destroy()
  await product.destroy()
  await cart.destroy()
}))


test('POST -> BASE_URL, should create a purchase from the cart', async () => {
  const res = await request(app)
    .post(BASE_URL)
    .set('Authorization', `Bearer ${TOKEN}`)

  expect(res.statusCode).toBe(201)
  expect(res.body).toBeInstanceOf(Array)
  expect(res.body).toHaveLength(1)
  expect(res.body[0]).toHaveProperty('productId')
  expect(res.body[0]).toHaveProperty('quantity')
  expect(res.body[0].quantity).toBe(cart.quantity)
});

test('GET -> BASE_URL_PURCHASE, should return all purchases', async () => {
  const res = await request(app)
    .get(BASE_URL)
    .set('Authorization', `Bearer ${TOKEN}`)

  expect(res.statusCode).toBe(200)
  expect(res.body).toBeInstanceOf(Array)
  expect(res.body.length).toBeGreaterThan(0)
  expect(res.body[0]).toHaveProperty('productId')
  expect(res.body[0]).toHaveProperty('quantity')
})
