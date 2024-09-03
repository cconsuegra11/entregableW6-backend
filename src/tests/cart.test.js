require('../models')
const request = require('supertest')
const app = require('../app')
const Category = require('../models/Category')
const Product = require('../models/Product')

const BASE_URL = '/api/v1/cart'
const BASE_URL_LOGIN = '/api/v1/users/login'
let TOKEN
let cartId
let productId
let category
let product
let cart
let userId

beforeAll(async () => {
  const user = {
    email: "carmen@gmail.com",
    password: "carmen1234",
  }
  const res = await request(app)
    .post(BASE_URL_LOGIN)
    .send(user)
  TOKEN = res.body.token

  category = await Category.create({ name: 'fashion' })

  const newProduct = {
    title: 'Red High Heels',
    description: 'Elegant red high heels, perfect for formal occasions.',
    price: 45.30,
    categoryId: category.id 
  };
  product =  await Product.create(newProduct)
  productId = product.id
  userId = res.body.id

  cart = {
    userId,
    productId,
    quantity: 7
  }
})

afterAll((async () => {
  await category.destroy()
  await product.destroy()
}))


test('POST -> BASE_URL, should add a product to the cart', async () => {
  const res = await request(app)
    .post(BASE_URL)
    .set('Authorization', `Bearer ${TOKEN}`)
    .send(cart)
 
  cartId = res.body.id
  expect(res.statusCode).toBe(201)
  expect(res.body).toBeDefined()

  const prop = [ 'userId', 'productId', 'quantity']
  prop.forEach((colum) => {
    expect(res.body[colum]).toBe(cart[colum])
  })
})

test('GET -> BASE_URL, should return all products in the cart', async () => {
  const res = await request(app)
    .get(BASE_URL)
    .set('Authorization', `Bearer ${TOKEN}`)

  expect(res.statusCode).toBe(200)
  expect(res.body).toBeDefined()
  expect(res.body).toHaveLength(1)
  expect(res.body[0].id).toBe(cartId)
});

test('GET -> BASE_URL/:id, should return the specific product in the cart', async () => {
  const res = await request(app)
    .get(`${BASE_URL}/${cartId}`)
    .set('Authorization', `Bearer ${TOKEN}`)

  expect(res.statusCode).toBe(200)
  expect(res.body).toBeDefined()
  const prop = [ 'userId', 'productId', 'quantity']
  prop.forEach((colum) => {
    expect(res.body[colum]).toBe(cart[colum])
  })
})

test('PUT -> BASE_URL/, should update the quantity of a product in the cart', async () => {
  const updateProduct = {
    userId,
    quantity: 7
  };

  const res = await request(app)
    .put(`${BASE_URL}/${cartId}`)
    .set('Authorization', `Bearer ${TOKEN}`)
    .send(updateProduct)

  expect(res.statusCode).toBe(200)
  expect(res.body).toBeDefined()
  const prop = [ 'userId', 'quantity']
  prop.forEach((colum) => {
    expect(res.body[colum]).toBe(cart[colum])
  })
})

test('DELETE -> BASE_URL/:id, should remove a product from the cart', async () => {
  const res = await request(app)
    .delete(`${BASE_URL}`)
    .set('Authorization', `Bearer ${TOKEN}`)

  expect(res.statusCode).toBe(204);
});