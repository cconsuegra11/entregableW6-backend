const request = require("supertest")
const app = require('../app')
const supertest = require("supertest")

const BASE_URL = '/api/v1/users'
let TOKEN
let userId


beforeAll(async () => {
  const user = {
    email: "carmen@gmail.com",
    password: "carmen1234",
  }
  const res = await request(app)
    .post(`${BASE_URL}/login`)
    .send(user)
  TOKEN = res.body.token
})

const user = {
  firstName: "Carlos",
  lastName: "Mendez",
  email: "carlos.mendez@gmail.com",
  password: "academlo2024",
  phone: "+575314567890"
}

test("POST -> BASE_URL, should return statusCode 201, and res.body.firstName === user.firstName", async () => {

  const columns = ['firstName', 'lastName', 'email', 'phone']
  const res = await request(app)
    .post(BASE_URL)
    .send(user)

  userId = res.body.id

  expect(res.statusCode).toBe(201)
  expect(res.body).toBeDefined()
  columns.forEach((column) => {
    expect(res.body[column]).toBe(user[column])
  })
})

test("GET -> BASE_URL, should return statusCode 200, and res.body.length === 2", async () => {

  const res = await supertest(app)
    .get(BASE_URL)
    .set('Authorization', `Bearer ${TOKEN}`)

  expect(res.statusCode).toBe(200)
  expect(res.body).toBeDefined()
  expect(res.body).toHaveLength(2)

})

test("PUT -> 'BASE_URL/:ID', should return statusCode 200, and res.body.firstName === userUpdate.firstName", async () => {

  const userUpdate = {
    firstName: "Maria"
  }
  const res = await request(app)
    .put(`${BASE_URL}/${userId}`)
    .send(userUpdate)
    .set('Authorization', `Bearer ${TOKEN}`)

  expect(res.statusCode).toBe(200)
  expect(res.body).toBeDefined()
  expect(res.body.firstName).toBe(userUpdate.firstName)
})

test("POST -> 'BASE_URL/LOGIN', should return status code 200, and res.body.user.email === hits.email", async () => {
  const hits = {
    email: "carlos.mendez@gmail.com",
    password: "academlo2024",
  }

  const res = await request(app)
    .post(`${BASE_URL}/login`)
    .send(hits)

  expect(res.statusCode).toBe(200)
  expect(res.body).toBeDefined()
  expect(res.body.token).toBeDefined()
  expect(res.body.email).toBe(hits.email)

})


test("POST -> 'BASE_URL/LOGIN', should return status code 401", async () => {
  const hits = {
    email: "carlos.mendez@gmail.com",
    password: "invalidPassword",
  }
  const res = await request(app)
    .post(`${BASE_URL}/login`)
    .send(hits)
  expect(res.statusCode).toBe(401)
})


test("DELETE -> 'BASE_URL/:ID', should return statusCode 204", async () => {
  const res = await request(app)
    .delete(`${BASE_URL}/${userId}`)
    .set('Authorization', `Bearer ${TOKEN}`)
  expect(res.statusCode).toBe(204)
})
