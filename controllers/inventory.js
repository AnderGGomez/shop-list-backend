const inventoryRouter = require('express').Router()
const Inventory = require('../models/inventory')
const Order = require('../models/order')
const jwt = require('jsonwebtoken')
const { default: mongoose } = require('mongoose')

inventoryRouter.get('/', async (request, response) => {
  const decodeToken = jwt.verify(request.token, process.env.SECRET)
  if (!request.token || !decodeToken) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const inventory = await Inventory.findOne({ user: decodeToken.id })
  return response.status(200).json(inventory)
})

inventoryRouter.post('/:id/products', async (request, response) => {
  const decodeToken = jwt.verify(request.token, process.env.SECRET)
  if (!request.token || !decodeToken) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const inventoryId = request.params.id
  const product = {
    ...request.body,
    productID: new mongoose.Types.ObjectId()
  }
  const inventory = await Inventory.findById(inventoryId)

  if (!inventory) {
    return response.status(404).json({ error: 'recurso no encontrado' })
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
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const inventoryId = request.params.id
  const products = request.body

  const inventory = await Inventory.findOne({user: decodeToken.id})

  if(inventory.setExpense){
    return response.status(428).json({error: 'El recurso ya fue actualizado'})
  }

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
    })
 
  const orderObj = {
    products: inventoryUpdate.products,
    inventory: inventoryUpdate.id,
    user : inventoryUpdate.user
  }
  await Order.insertMany([orderObj])
  return response.status(200).json(inventoryUpdate)
})

inventoryRouter.put('/:id/info-product', async (request, response) => {
  const decodeToken = jwt.verify(request.token, process.env.SECRET)
  if (!request.token || !decodeToken) {
    return response.status(401).json({ error: 'token missing or invalid' })
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

  const productUpdated = result.products.filter(p => p.productID == product.productID)
  return response.status(200).json(...productUpdated)
})

inventoryRouter.put('/:id/shop-products', async(request, response) => {
  const decodeToken = jwt.verify(request.token, process.env.SECRET)
  if(!request.token || !decodeToken){
    return response.status(401).json({error: 'Token missing or invalid'})
  }

  const inventoryId = request.params.id
  const products = request.body

  const inventory = await Inventory.findById(inventoryId)

  if(!inventory.setExpense){
    return response.status(428).json({error: 'el recursos no se puede actualizar, no hay ordenes activas.'})
  }

  const promisesArray = products.map(async product => {
    await Inventory.updateOne(
      {_id: inventoryId},
      {
        $inc: { 'products.$[item].quantity': product.quantity}
      },
      {
        arrayFilters: [
          { 'item.productID': product.productID}
        ]
      }
    )
  })

  await Promise.all(promisesArray)

  const inventoryUpdate = await Inventory.findOneAndUpdate(
    {_id: inventoryId},
    {
      $set: {setExpense: false}
    },
    {
      new: true
    }
  )

  return response.status(200).json(inventoryUpdate)
})

module.exports = inventoryRouter

