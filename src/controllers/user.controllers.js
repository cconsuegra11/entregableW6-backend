const catchError = require('../utils/catchError');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config()

// --> GET
const getAll = catchError(async(req, res) => {
    const results = await User.findAll(
      { attributes: 
        { exclude: ['password'] }
      }
    );
    return res.json(results);
});


// --> POST
const create = catchError(async(req, res) => {
  const user = await User.create(req.body)
  const newUser = { ...user.dataValues }
  delete newUser.password
  return res.status(201).json(newUser)
});


// --> DELETE
const remove = catchError(async(req, res) => {
    const { id } = req.params;
    const result = await User.destroy({ where: {id} });
    if(!result) return res.sendStatus(404);
    return res.sendStatus(204);
});


// --> PUT
const update = catchError(async(req, res) => {
    const { id } = req.params
    const { firstName, lastName } = req.body
    const body = { firstName, lastName }
    const user = await User.update(
        body,
        { where: { id }, returning: true }
    );

    if(user[0] === 0) return res.sendStatus(404)
    const updateUser = user[1][0].toJSON()
    delete updateUser.password
    return res.json(updateUser)
});


const login = catchError(async(req, res) => {
    const { email, password } = req.body
    const user = await User.findOne(
      { where: { email }
    })
    if (!user) {
      return res.status(404).json({message: 'user not found'})
    }
  
    const passwordIsValid = await bcrypt.compare(password, user.password)
    if (!passwordIsValid) {
      return res.status(401).json({message: 'Invalid password'})
    }
  
    const user2 = {...user.dataValues }
    delete user2.password
    const token = jwt.sign(user2, process.env.TOKEN_SECRET, { expiresIn: '1d' })
    return res.json({ ...user2, token })
  })


module.exports = {
    getAll,
    create,
    remove,
    update,
    login
}