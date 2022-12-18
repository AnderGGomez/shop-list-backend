const bcryptjs = require ('bcryptjs')
const userRouter = require('express').Router()
const User = require('../models/user')
const Inventory = require('../models/inventory')

userRouter.get('/:id', async (request, response) => {
  const id = request.params.id
  const user = await User.findById(id)
  response.json(user)
})

userRouter.post('/', async (request, response) => {
  const {groupName, password, username} = request.body
  const userExist = await User.findOne({username})
  if(userExist){
    return response.status(400).json({error: 'Ya existe este nombre de usuario'})
  }

  const saltRounds = 10
  const passwordHash = await bcryptjs.hash(password, saltRounds)

  const userObj = new User({
    groupName,
    username,
    passwordHash
  })

  const userSaved = await userObj.save()
  const inventoryObj = new Inventory({
    products: [],
    user: userSaved.id
  })
  await inventoryObj.save()
  response.status(201).json(userSaved)
})

module.exports = userRouter