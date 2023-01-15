const orderRouter = require('express').Router()
const Order = require('../models/order')
const jwt = require('jsonwebtoken')
const Inventory = require('../models/inventory')



orderRouter.get('/', async(request, response) => {

  const decodeToken = jwt.verify(request.token, process.env.SECRET)
  if(!request.token || !decodeToken){
    response.status(401).json({error: 'token missing or invalid'})
  }
  
  const inventory = await Inventory.findOne({user: decodeToken.id})
  let latest = {}
  if(inventory.setExpense){
    const order = await Order.find({user: decodeToken.id})
    latest = order.reduce((prev, current) => prev.updatedAt > current.updatedAt ? prev : current)
  }
  
  return response.status(200).json(latest)
})




module.exports = orderRouter