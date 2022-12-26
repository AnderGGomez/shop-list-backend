const inventoryRouter = require('express').Router()
const Inventory = require('../models/inventory')
const jwt = require('jsonwebtoken')
const { default: mongoose } = require('mongoose')

inventoryRouter.get('/', async (request, response) => {
  const decodeToken = jwt.verify(request.token, process.env.SECRET)
  console.log(request)
  if (!request.token || !decodeToken) {
    response.status(401).json({ error: 'token missing or invalid' })
  }

  const inventory = await Inventory.findOne({ user: decodeToken.id })
  response.status(200).json(inventory)
})
/*
inventoryRouter.get('/:id', async (request, response) => {
  const inventoryId = request.params.id;

  const productReturned = await Inventory.findOne(
    {
      _id: inventoryId,
    },
    {
      products: {
        $elemMatch: {name: 'Queso'}
      }
    }
  )
  return response.status(200).json(productReturned)
})
*/

inventoryRouter.post('/:id/products', async (request, response) => {
  const decodeToken = jwt.verify(request.token, process.env.SECRET)
  if (!request.token || !decodeToken) {
    response.status(401).json({ error: 'token missing or invalid' })
  }

  const inventoryId = request.params.id
  const product = {
    ...request.body,
    productID: new mongoose.Types.ObjectId()
  }
  const inventory = await Inventory.findById(inventoryId)

  if (!inventory) {
    response.status(404).json({ error: 'recurso no encontrado' })
  }

  const exists = inventory.products.find(item => item.name == product.name)
  if (exists) {
    return response.status(200).json(inventory)
  }

  const result = await Inventory.findOneAndUpdate(
    { _id: inventoryId },
    {
      $push: {
        'products': product
      }
    },{
      new: true
    }
  )
  const productSaved = result.products.filter(p => p.name === product.name)
  return response.status(201).json(...productSaved)

})

inventoryRouter.put('/:id/products', async (request, response) => {
  const decodeToken = jwt.verify(request.token, process.env.SECRET)
  if (!request.token || !decodeToken) {
    response.status(401).json({ error: 'token missing or invalid' })
  }

  const inventoryId = request.params.id
  const products = request.body
  
  const promisesArray = products.map(async product => {
      await Inventory.updateOne(
      { _id: inventoryId },
      {
        $set: { 'products.$[item]': product },
      },
      {
        arrayFilters: [{
          "item.productID": product.productID
        }],
      }
    )
  })
  await Promise.all(promisesArray)

  const inventoryUpdate = await Inventory.findOneAndUpdate(
    {_id: inventoryId},
    {
      $set: {setExpense: true}
    },{
      new : true
    }
    )
  return response.status(200).json(inventoryUpdate)
})

inventoryRouter.put('/:id/info-product', async (request, response) => {
  const decodeToken = jwt.verify(request.token, process.env.SECRET)
  if (!request.token || !decodeToken) {
    response.status(401).json({ error: 'token missing or invalid' })
  }

  const inventoryId = request.params.id
  const product = request.body

  const result = await Inventory.findOneAndUpdate(
    { _id: inventoryId },
    {
      $set: { 'products.$[item]': product },
    },
    {
      arrayFilters: [{
        "item.productID": product.productID
      }],
      new: true
    }
  )

  const productUpdated = result.products.filter(p => p.name == product.name)
  return response.status(200).json(...productUpdated)
})
module.exports = inventoryRouter

