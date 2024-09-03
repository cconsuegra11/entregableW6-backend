const User = require("../../models/User")

const userCreate = async () => {

  const user = {
    firstName: "Carmen",
    lastName: "Gonzales",
    email: "carmen@gmail.com",
    password: "carmen1234",
    phone: "+5767653124"
  }

  await User.create(user)
}


module.exports = userCreate